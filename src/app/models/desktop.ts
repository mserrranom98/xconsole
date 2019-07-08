export class Usuario {
  constructor(
    public id: number,
    public first_name: string,
    public last_name: string,
    public display_name: string,
    public email: string,
    public created_date: string,
    public job_title: string,
    public avatar: string,
    public credential: string,
    public directories_id: number,
    public directories_name: string,
    public enabled: boolean,
    public certificate: string
  ) {
  }
}

export class Pages {
    constructor(
      public id: number,
      public section: string,
      public name: string,
      public description: string,
      public icon: string,
      public clas: string,
      public badge: string,
      public badgeclass: string,
      public externalLink: boolean,
      public deploy: number,
      public enabled: boolean,
      public submenu: string
    ) {
    }
  }

  export class NameStatus {
    constructor(
      public id: number,
      public name: string,
      public enabled: boolean
    ) {}
  }

  export class Section {
    constructor(
      public id: string,
      public name: string,
      public enabled: string,
      public nivel: string,
      public smenu: string
    ) {}
  }

  export class GetActionSection {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class GetUpdateSection {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class Profiles {
    constructor(
      public id: number,
      public name: string,
      public created_date: string,
      public enabled: boolean
    ) {
    }
  }

  export class Directories {
    constructor(
      public id: number,
      public directory_name: string,
      public created_date: string,
      public description: string,
      public imp_class: string,
      public directory_type: string,
      public port: number,
      public url: string,
      public certificate: string,
      public authentication: string,
      public dnUser: string,
      public dnGroups: string,
      public enabled: string
    ) {
    }
  }

  export class Institution {
    constructor(
      public id: number,
      public name: string,
      public code: string,
      public branch: string,
      public industry: string,
      public country: string,
      public city: string,
      public district: string,
      public address: string,
      public phone: string,
      public fax: string,
      public mail: string,
      public contact: string,
      public certificate: string,
      public enabled: boolean,
    ) {
    }
  }

  export class GetActionTables {
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

  export class GetTablesUnion {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class GetActionInsert {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class GetActionUpdate {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: number},
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class List {
    constructor(
      public id: number,
      public value: string
    ) {
    }
  }

  export class GetActionFeatures {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class DropTablesUnion {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class ForgotPass {
    constructor(
      public serviceName: string,
      public serviceArguments: [
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class GenPass {
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

  export class Pass {
    constructor(
      public userName: string
    ) {
    }
  }

  export class UpdateAvatar {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class GetFeatures {
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

  export class ChangePass {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export class GetMenuPages {
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

  export class IUPrfpages {
    constructor(
      public serviceName: string,
      public userToken: string,
      public sessionUUID: string,
      public jsessionID: string,
      public serviceArguments: [
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string},
        {argument: string, value: string}
      ]
    ) {
    }
  }
