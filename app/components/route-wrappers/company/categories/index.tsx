import { type CompanyCategory } from "@prisma/client"
import * as Dialog from "@radix-ui/react-dialog"
import { Separator } from "@radix-ui/react-select"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { IconMatch } from "~/components/libs/icon"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { DialogContent } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Row } from "~/components/ui/row"
import { SubTitle } from "~/components/ui/sub-title"
import { SubTitleDescription } from "~/components/ui/sub-title-description"
import { useRootLoaderData } from "~/hooks/use-root-loader-data"
import { type WithoutDateReference } from "~/types/generic"

import { type TMode } from ".."

export type TCompanyCategory = WithoutDateReference<CompanyCategory>

const useCompanyCategory = ({
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
  const [categoryName, setCategoryName] = useState(name)

  const [addEnabled, setAddEnabled] = useState(false)
  const [editEnabled, setEditEnabled] = useState(false)
  const [deleteEnabled, setDeleteEnabled] = useState(false)

  const [hasError, setHasError] = useState(false)
  const [mode, setMode] = useState<TMode>(null)

  const { isFetching } = useQuery({
    queryKey: [],
    queryFn: async () =>
      await fetch("/api/company-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName, companyId }),
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
      await fetch("/api/company-category", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName, companyId }),
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
      await fetch("/api/company-category", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, newName: categoryName, companyId }),
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
    setCategoryName,
    categoryName,
    setAddEnabled,
    setDeleteEnabled,
    setEditEnabled,
    hasError,
    setHasError,
    mode,
    setMode,
  }
}

export const CompanyCategories = ({
  companyCategories,
  refetchCategories,
}: {
  companyCategories: TCompanyCategory[]
  refetchCategories: () => void
}) => {
  const { userData, token } = useRootLoaderData()

  const CompanyCategory = (companyCategory?: Partial<TCompanyCategory>) => {
    const {
      hasError,
      setCategoryName,
      mode,
      isFetching,
      categoryName,
      setMode,
      setAddEnabled,
      setDeleteEnabled,
      setEditEnabled,
      setHasError,
    } = useCompanyCategory({
      token: token!,
      companyId: userData?.company.id,
      refetch: refetchCategories,
      name: companyCategory?.name,
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
        title: "Edit category",
        description: "Are you sure you want to edit this category?",
        body: (prev?: string) => (
          <div className="flex gap-2">
            <Badge variant="destructive">{prev}</Badge>
            {"->"}
            <Badge>{categoryName}</Badge>
          </div>
        ),
        button: "Edit",
        confirm: () => setEditEnabled(true),
      },
      delete: {
        title: "Delete category",
        description: "Are you sure you want to delete this category?",
        body: (current?: string) => (
          <div className="flex">
            <Badge variant="destructive">{current}</Badge>
          </div>
        ),
        button: "Delete",
        confirm: () => setDeleteEnabled(true),
      },
    }

    const isAddDisabled = !categoryName
    const isEditDisabled = categoryName === companyCategory?.name
    const isDeleteDisabled = categoryName !== companyCategory?.name

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (hasError) {
        setHasError(false)
      }
      setCategoryName(e.target.value)
    }

    return (
      <Dialog.Root>
        <Row>
          <Input
            type={"text"}
            onChange={onChange}
            className="flex flex-1"
            value={categoryName}
            placeholder="Engineering, Finance, Human Resources, Marketing ..."
          />

          {companyCategory?.id ? (
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
              <div className="mt-6">{dialogContents[mode].body(companyCategory?.name)}</div>
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
      <SubTitle>Categories</SubTitle>
      <SubTitleDescription>Manage all the organization's categories</SubTitleDescription>
      <Separator />
      <center>
        {companyCategories?.map(companyCategory => (
          <CompanyCategory key={companyCategory.id} {...companyCategory} />
        ))}
        <CompanyCategory />
      </center>
    </Card>
  )
}
