export class Login {
    constructor(
      public userName: string,
      public userPassword: string,
      public directoryName: string
    ) {
    }
  }

  export class ChangePass {
    constructor(
      public serviceName: string,
      public userToken: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class Perfiles {
    constructor(
      public identCurrent: number,
      public name: string
    ) {
    }
  }

  export class PageMenu {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class Paginas {
    constructor(
      public  path: string,
      public  title: string,
      public  icon: string,
      public  cssclass: string,
      public  badge: string,
      public  badgeClass: string,
      public  isExternalLink: boolean,
      public  submenu: [{}]
    ) {
    }
  }

  export class Features {
    constructor(
      public feature: string,
      public enabled: boolean
    ) {}
  }

  export class Logout {
    constructor(
      public userName: string,
      public sessionUUID: string,
      public jsessionID: string,
      public userToken: string,
      public directoryName: string
    ) {}
  }

  export class Session {
    constructor(
      public jsessionID: string
    ) {
    }
  }