import { IAddon, IApp, IAppWithDomain, IDNS, ITeam } from "../types/haas";
import { IUser } from "../types/haas";

export const devUser1: IUser = {
  ID: "1",
  Name: "vera",
  SlackUserID: "U015B2729C3",
  Avatar:
    "https://dl.airtable.com/.attachmentThumbnails/62f061726ec9fb6958cef4f80b2e3198/eba2c4de",
};

export const personalTeam: ITeam = {
  ID: 1,
  Automatic: true,
  Name: devUser1.Name,
  Personal: true,
  Apps: [],
  Avatar: devUser1.Avatar,
  Expenses: "69.42",
  Users: [devUser1],
};

export const personalApp: IApp = {
  ID: 1,
  Name: "Scrappy Dev",
  ShortName: "Scrappy Dev",
  TeamID: 1,
};

export const personalAppWithDomain: IAppWithDomain = {
  ID: 2,
  Name: "The Teller",
  ShortName: "The Teller",
  TeamID: 1,
  Domains: [
    {
      hostname: "gql.example.com",
      config: true,
      inUseByOtherApp: false,
    },
    {
      hostname: "teller.prod01.servers.example.com",
      config: false,
      inUseByOtherApp: false,
    },
    {
      hostname: "teller.but-for.hackclub.com",
      config: false,
      inUseByOtherApp: true,
    },
  ],
};

export let devAddons: IAddon[] = [
  {
    price: "3",
    id: "0",
    name: "PostgreSQL",
    activated: false,
    img: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
    description:
      "PostgreSQL is the best database to ever exist. Sometimes it's hard to understand why people use other databases like <insert DB here>. Postgres >>>",
    storage: "1.2 GB",
    config: {
      ddfddfy47: {
        key: "USER",
        value: "ROOT",
        valueEditable: true,
        keyEditable: true,
        obscureValue: false,
      },
      djfusdhf8e74: {
        key: "PASSWORD",
        value: "iL0V3dA1a",
        valueEditable: true,
        keyEditable: false,
        obscureValue: true,
      },
    },
  },
  {
    price: "3",
    id: "1",
    name: "MongoDB",
    activated: true,
    storage: "3.6 GB",
    img: "https://media-exp1.licdn.com/dms/image/C560BAQGC029P7UbAMQ/company-logo_200_200/0/1562088387077?e=2159024400&v=beta&t=lEY4Obku1xJ3BB_BpN3Np9ILy8_zaB1_yjsfH9A57qs",
    description:
      "MongoDB is the best database to ever exist. Sometimes it's hard to understand why people use other databases like <insert DB here>. MongoDB >>>",
    config: {
      u488h: {
        key: "ADMIN_USER",
        value: "root",
        keyEditable: false,
        valueEditable: true,
        obscureValue: false,
      },
      hfofs9: {
        key: "PASSWORD",
        value: "uwuowo123",
        keyEditable: false,
        valueEditable: true,
        obscureValue: true,
      },
    },
  },
  {
    price: "3",
    id: "2",
    name: "Redis",
    activated: false,
    storage: "1.9 GB",
    img: "https://www.nditech.org/sites/default/files/styles/small_photo/public/redis-logo.png?itok=LrULOkWT",
    description:
      "Redis is the best database to ever exist. Sometimes it's hard to understand why people use other databases like <insert DB here>. Redis >>>",
    config: {
      ddfsfyy5: {
        key: "ADMIN_USER",
        value: "root",
        keyEditable: false,
        valueEditable: true,
        obscureValue: false,
      },
      idsf8: {
        key: "PASSWORD",
        value: "uwuowo123",
        keyEditable: false,
        valueEditable: true,
        obscureValue: true,
      },
    },
  },
];

export const devAddonsOriginal: IAddon[] = devAddons;

export const DNS: IDNS = {
  type: "A",
  value: "real.haas.server.ip",
  defaultSubdomains: [
    "but-for.hackclub.com",
    "haas.hackclub.com",
    "hackclub.app",
  ],
};
