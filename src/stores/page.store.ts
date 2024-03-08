import { serverIcon } from "@/data/server/Server";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useLoginStore } from "./login.store";
import {
  type GroupAsset,
  type IconAsset,
  isPassed,
  optArray,
  optString,
  parseGroup2s,
  parseIcon,
  parseKey,
} from "@/U";
import { IconPack } from "@/data/icon-pack/IconPack";

export class NavPage {
  key: string = "";
  title: string = "";
  icon: IconAsset | null = null;
  userPermissions: unknown[] = [];
  groups: NavViewGroup[] = [];

  setKey(key: string) {
    this.key = parseKey(key);
    return this;
  }
  setTitle(title: string) {
    this.title = optString(title);
    return this;
  }
  setIcon(icon: IconPack) {
    this.icon = parseIcon(icon);
    return this;
  }
  setUserPermissions(userPermissions: unknown[]) {
    this.userPermissions = userPermissions;
    return this;
  }
  setGroups(groups: NavViewGroup[]) {
    this.groups = groups;
    return this;
  }
}
export class NavView {
  key: string = "";
  title: string = "";
  icon: IconAsset | null = null;

  setKey(key: string) {
    this.key = parseKey(key);
    return this;
  }
  setTitle(title: string) {
    this.title = optString(title);
    return this;
  }
  setIcon(icon: IconPack) {
    this.icon = parseIcon(icon);
    return this;
  }
}
export class NavViewGroup {
  key: string = "";
  title: string = "";
  icon: unknown = "";
  values: GroupAsset[] = [];
  children: unknown;
  userPermissions: unknown[] = [];
  isLink: boolean = false;
  isQuery: boolean = false;
  groups: NavView[] = [];

  setKey(key: string) {
    this.key = parseKey(key);
    return this;
  }
  setTitle(title: string) {
    this.title = optString(title);
    return this;
  }
  setIcon(icon: unknown) {
    this.icon = icon;
    return this;
  }
  setValues(values: any[]) {
    this.values = optArray(values);
    return this;
  }
  setChildren(children: unknown) {
    this.children = children;

    if (Array.isArray(children)) {
      this.values.unshift(...children);
    }

    return this;
  }
  setUserPermissions(userPermissions: unknown[]) {
    this.userPermissions = userPermissions;
    return this;
  }

  setIsLink(isLink: boolean) {
    this.isLink = isLink;
    return this;
  }
  setIsQuery(isQuery: boolean) {
    this.isQuery = isQuery;
    return this;
  }

  setGroups(groups: NavView[]) {
    this.groups = groups;
    return this;
  }
}

export const usePageStore = defineStore("page", () => {
  const route = useRoute();

  const managedPages: {
    key: string;
    title: string;
    icon: IconPack;
    userPermissions?: string[];
    _children?: () => GroupAsset[];
    _groups?: () => GroupAsset[];
  }[] = [
    {
      key: "home",
      title: "Home",
      icon: new IconPack(serverIcon("home-FFFFFF"), serverIcon("home-000000")),
    },
    {
      key: "product",
      title: "Search",
      icon: new IconPack(
        serverIcon("magnifying-glass"),
        serverIcon("magnifying-glass"),
      ),
    },
    {
      key: "print",
      title: "Printing",
      icon: new IconPack(
        serverIcon("paper-FFFFFF"),
        serverIcon("paper-000000"),
      ),
    },
    {
      key: "manage",
      title: "Manage",
      icon: new IconPack(
        serverIcon("manage-FFFFFF"),
        serverIcon("manage-000000"),
      ),
      _children() {
        return [
          {
            key: "profile",
            title: "Your Profile",
            icon: new IconPack(
              serverIcon("profile-FFFFFF"),
              serverIcon("profile-000000"),
            ),
          },
        ];
      },
      _groups() {
        return [
          {
            key: "record",
            title: "Record",
            children: [
              {
                key: "customer",
                title: "Customers",
                icon: new IconPack(
                  serverIcon("customers-FFFFFF"),
                  serverIcon("customers-000000"),
                ),

                userPermissions: ["admin", "staff"],
              },
              {
                key: "service",
                title: "Services",
                icon: new IconPack(
                  serverIcon("service-FFFFFF"),
                  serverIcon("service-000000"),
                ),
                userPermissions: ["admin", "staff"],
              },
              {
                key: "order",
                title: "Orders",
                icon: new IconPack(
                  serverIcon("order-FFFFFF"),
                  serverIcon("order-000000"),
                ),
                userPermissions: ["admin", "staff"],
              },
            ],
          },
        ];
      },

      userPermissions: ["admin", "staff"],
    },
  ];

  const pages = computed(() => {
    const user = useLoginStore().user;

    const pages = managedPages;
    if (pages.length < 1) return [];

    const listGroup1 = pages.map((page) => {
      const navPage = new NavPage()
        .setKey(page.key)
        .setTitle(page.title)
        .setIcon(page.icon);
      if (page.userPermissions) {
        navPage.setUserPermissions(page.userPermissions);
      }

      const returnParsedGroups = parseGroup2s([
        {
          key: "",
          title: "",
          values: typeof page._children === "function" ? page._children() : [],
        },
        ...(typeof page._groups === "function" ? page._groups() : []),
      ])
        .map((obj) => {
          return obj.setIsLink(true).setIsQuery(false);
        })
        .filter((group) => {
          return isPassed(user, group.userPermissions);
        })
        .reduce((groups: NavViewGroup[], group) => {
          const views = optArray(group.values)
            .filter((value: GroupAsset) => {
              return isPassed(user, value.userPermissions);
            })
            .map((value: GroupAsset) => {
              const navView = new NavView()
                .setKey(value.key)
                .setTitle(value.title);
              if (value.icon) navView.setIcon(value.icon);

              return navView;
            });

          let found = groups.find((group) => group.key === navPage.key);
          if (!found) {
            found = new NavViewGroup()
              .setKey(group.key)
              .setTitle(group.title)
              .setIsLink(group.isLink)
              .setIsQuery(group.isQuery);

            groups.push(found);
          }
          found.groups.push(...views);

          return groups;
        }, []);

      return navPage.setGroups(returnParsedGroups);
    });

    listGroup1.forEach((group1) => {
      const listGroup2 = group1.groups;
      listGroup2.forEach((group2) => {
        const listGroup3 = group2.groups;
        if (listGroup3.length === 0) {
          listGroup2.splice(listGroup2.indexOf(group2), 1);
        }
      });
    });

    return listGroup1;
  });
  const paths = computed(() => route.path.split("/").filter((path) => path));
  const currentPaths = computed(() => {
    let { fullPath } = route;

    const questionMarkIndex = fullPath.indexOf("?");
    if (questionMarkIndex !== -1) {
      fullPath = fullPath.substring(0, questionMarkIndex);
    }

    return fullPath.split(/[/]/).filter((path) => path);
  });
  const currentPageKey = computed(() => {
    const paths = currentPaths.value;
    return paths.length > 0 ? paths[0] : "";
  });
  const currentViewKey = computed(() => {
    const paths = currentPaths.value;
    return paths.length > 1 ? paths[1] : "";
  });

  return {
    pages,
    paths,
    currentPaths,
    currentPageKey,
    currentViewKey,
  };
});
