import { type CompanyLocation } from "@prisma/client"
import * as Dialog from "@radix-ui/react-dialog"
import { Separator } from "@radix-ui/react-select"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { IconMatch } from "~/components/libs/icon"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { DialogContent } from "~/components/ui/dialog"
import { Row } from "~/components/ui/row"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { SubTitle } from "~/components/ui/sub-title"
import { SubTitleDescription } from "~/components/ui/sub-title-description"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { type WithoutDateReference } from "~/types/generic"
import countries from "~/utils/countries"

import { type TMode } from ".."

export type TCompanyLocation = WithoutDateReference<CompanyLocation>

const useCompanyLocation = ({
  token,
  name,
  companyId,
  refetch,
}: {
  token: string
  companyId?: string
  name?: string
  refetch: () => void
}) => {
  const [locationName, setLocationName] = useState(name)

  const [addEnabled, setAddEnabled] = useState(false)
  const [editEnabled, setEditEnabled] = useState(false)
  const [deleteEnabled, setDeleteEnabled] = useState(false)

  const [hasError, setHasError] = useState(false)
  const [mode, setMode] = useState<TMode>(null)

  const { isFetching } = useQuery({
    queryKey: [],
    queryFn: async () =>
      await fetch("/api/company-location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: locationName, companyId }),
      })
        .then(value => {
          setAddEnabled(false)
          refetch()
          return value
        })
        .catch(() => setHasError(true)),
    enabled: addEnabled,
  })

  useQuery({
    queryKey: [],
    queryFn: async () =>
      await fetch("/api/company-location", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: locationName, companyId }),
      })
        .then(value => {
          setDeleteEnabled(false)
          refetch()
          return value
        })
        .catch(() => setHasError(true)),
    enabled: deleteEnabled,
  })

  useQuery({
    queryKey: [],
    queryFn: async () =>
      await fetch("/api/company-location", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, newName: locationName, companyId }),
      })
        .then(value => {
          setEditEnabled(false)
          refetch()
          return value
        })
        .catch(() => setHasError(true)),
    enabled: editEnabled,
  })

  return {
    isFetching,
    setLocationName,
    locationName,
    setAddEnabled,
    setDeleteEnabled,
    setEditEnabled,
    hasError,
    setHasError,
    mode,
    setMode,
  }
}

export const CompanyLocations = ({
  companyLocations,
  refetchLocations,
}: {
  companyLocations: TCompanyLocation[]
  refetchLocations: () => void
}) => {
  const { userData, token } = useRootLoaderData()

  const CompanyLocation = (companyLocation?: Partial<TCompanyLocation>) => {
    const {
      hasError,
      setLocationName,
      mode,
      isFetching,
      locationName,
      setMode,
      setAddEnabled,
      setDeleteEnabled,
      setEditEnabled,
      setHasError,
    } = useCompanyLocation({
      token: token!,
      companyId: userData?.company.id,
      refetch: refetchLocations,
      name: companyLocation?.name,
    })

    const onAdd = () => {
      if (isAddDisabled) {
        return
      }
      setMode("add")
      setAddEnabled(true)
    }

    const onEdit = () => {
      if (isEditDisabled) {
        return
      }
      setMode("edit")
    }

    const onDelete = () => {
      if (isDeleteDisabled) {
        return
      }
      setMode("delete")
    }

    const dialogContents = {
      edit: {
        title: "Edit Location",
        description: "Are you sure you want to edit this location?",
        body: (prev?: string) => (
          <div className="flex gap-2">
            <Badge variant="destructive">{prev}</Badge>
            {"->"}
            <Badge>{locationName}</Badge>
          </div>
        ),
        button: "Edit",
        confirm: () => setEditEnabled(true),
      },
      delete: {
        title: "Delete Location",
        description: "Are you sure you want to delete this location?",
        body: (current?: string) => (
          <div className="flex">
            <Badge variant="destructive">{current}</Badge>
          </div>
        ),
        button: "Delete",
        confirm: () => setDeleteEnabled(true),
      },
    }

    const isAddDisabled = !locationName
    const isEditDisabled = locationName === companyLocation?.name
    const isDeleteDisabled = locationName !== companyLocation?.name

    const onChange = (value: string) => {
      setLocationName(value)
    }

    return (
      <Dialog.Root>
        <Row>
          <Select onValueChange={onChange} value={locationName} required>
            <SelectTrigger value={locationName}>
              <SelectValue className="flex flex-1" placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="max-h-40 overflow-y-scroll">
                {countries.map(({ country }) => (
                  <SelectItem key={country} value={country}>
                    <p className="inline-flex items-center gap-2">{country}</p>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {companyLocation?.id ? (
            <div className="flex gap-2">
              <Dialog.Trigger asChild>
                <Button
                  variant="outline"
                  disabled={isEditDisabled}
                  onClick={onEdit}
                  isLoading={mode === "edit" && isFetching}
                >
                  <IconMatch icon="note-pencil" />
                </Button>
              </Dialog.Trigger>
              <Dialog.Trigger asChild>
                <Button
                  variant="destructive"
                  disabled={isDeleteDisabled}
                  onClick={onDelete}
                  isLoading={mode === "delete" && isFetching}
                >
                  <IconMatch icon="x" />
                </Button>
              </Dialog.Trigger>
            </div>
          ) : (
            <Button
              variant="default"
              onClick={onAdd}
              disabled={isAddDisabled}
              isLoading={mode === "add" && isFetching}
            >
              <IconMatch icon="plus" />
            </Button>
          )}
        </Row>
        <Dialog.Portal>
          <Dialog.Overlay />
          <DialogContent>
            {mode && mode !== "add" ? (
              <Dialog.Title>{dialogContents[mode].title}</Dialog.Title>
            ) : null}

            {mode && mode !== "add" ? (
              <Dialog.Description>{dialogContents[mode].description}</Dialog.Description>
            ) : null}

            {mode && mode !== "add" ? (
              <div className="mt-6">{dialogContents[mode].body(companyLocation?.name)}</div>
            ) : null}

            <div style={{ display: "flex", marginTop: 10, justifyContent: "flex-end" }}>
              {mode && mode !== "add" ? (
                <Dialog.Close asChild>
                  <Button onClick={dialogContents[mode].confirm}>
                    {dialogContents[mode].button}
                  </Button>
                </Dialog.Close>
              ) : null}
            </div>
          </DialogContent>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  return (
    <Card className="flex flex-1 grow flex-col gap-4">
      <SubTitle>Locations</SubTitle>
      <SubTitleDescription>Manage all the organization's locations</SubTitleDescription>
      <Separator />
      <center>
        {companyLocations?.map(companyLocation => (
          <CompanyLocation key={companyLocation.id} {...companyLocation} />
        ))}

        <CompanyLocation />
      </center>
    </Card>
  )
}
