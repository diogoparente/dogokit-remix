/**
 * EDITME: Config Action Items: New and Manage
 */

export type ConfigActionItem = {
  actionNew: string
  actionManage: string
  icon: string
  name: string
  isEnabled: boolean
}

export function getActionItem(name: string) {
  return configActionItems.find(actionItem => actionItem.name === name)
}

export const configActionItems: ConfigActionItem[] = [
  {
    actionNew: "/posts/create",
    actionManage: "/posts",
    name: "Post",
    icon: "scroll",
    isEnabled: true,
  },
  {
    actionNew: "/events/create",
    actionManage: "/events",
    name: "Event",
    icon: "calendar-blank",
    isEnabled: false,
  },
  {
    actionNew: "/tags/create",
    actionManage: "/tags",
    name: "Tag",
    icon: "tag",
    isEnabled: false,
  },
  {
    actionNew: "/categories/create",
    actionManage: "/categories",
    name: "Category",
    icon: "squares-four",
    isEnabled: false,
  },
  {
    actionNew: "/images/create",
    actionManage: "/images",
    name: "Image",
    icon: "image",
    isEnabled: false,
  },
  {
    actionNew: "/users/create",
    actionManage: "/users",
    name: "User",
    icon: "user",
    isEnabled: false,
  },
]
