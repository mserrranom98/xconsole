// Listas
export class Listas {
    constructor(
      public peticion: string,
      public userName: string,
      public adm: string
    ) {
    }
  }

  export class ListaIU {
    constructor(
      public peticion: string,
      public userName: string,
      public lista: string,
      public titulo: string,
      public tipo: string
    ) {
    }
  }

  export class LDelete {
    constructor(
      public peticion: string,
      public userName: string,
      public lista: string
    ) {
    }
  }

  export class ListasItems {
    constructor(
      public peticion: string,
      public userName: string,
      public lista: string
    ) {
    }
  }

  export class LItemIU {
    constructor(
      public peticion: string,
      public userName: string,
      public lista: string,
      public item: string,
      public glosa: string
    ) {
    }
  }

  export class LItemDelete {
    constructor(
      public peticion: string,
      public userName: string,
      public lista: string,
      public item: string
    ) {
    }
  }

// Meta Listas
export class MetaListaSelect {
  constructor(
    public peticion: string,
    public userName: string
  ) {
  }
}

export class MetaListaInsert {
  constructor(
    public peticion: string,
    public userName: string,
    public metaLista: string,
    public listaAcceso: string,
    public listaDatos: string,
    public titulo: string
  ) {
  }
}

export class MetaListaDelete {
  constructor(
    public peticion: string,
    public userName: string,
    public metaLista: string
  ) {
  }
}

// Meta Lista Items
export class MetaListaItemSelect {
  constructor(
    public peticion: string,
    public userName: string,
    public metaLista: string
  ) {
  }
}

export class MetaListaItemSet {
  constructor(
    public peticion: string,
    public userName: string,
    public metaLista: string,
    public rows: [{itemAcceso: string, itemDato: string}]
  ) {
  }
}

export class DatosMetaLista {
  constructor(
    public peticion: string,
    public userName: string,
    public listaAcceso: string,
    public listaAcesoTitulo: string,
    public listaDatos: string,
    public listaDatosTitulo: string,
    public metaLista: string,
    public titulo: string
  ) {
  }
}
