export class ChangePass {
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

  export class ForgotPass {
    constructor(
      public serviceName: string,
      public serviceArguments: [
        {argument: string, value: string}
      ]
    ) {
    }
  }

  export let VARGLOBAL = {
    prueba: '',
    userToken: '',
    sessionUUID: '',
    jsessionID: '',
    perfil: '',
    user: ''
};