export type WithoutCompanyIdReference<T> = Omit<T, "companyId">

export type WithoutDateReference<T> = Omit<T, "createdAt" | "updatedAt">

export type WithoutCompanyIdReferenceAndDateReference<T> = WithoutCompanyIdReference<
  WithoutDateReference<T>
>
