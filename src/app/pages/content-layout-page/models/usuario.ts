export class Login {
    constructor(
      public userName: string,
      public userPassword: string,
      public userEmail: string
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
