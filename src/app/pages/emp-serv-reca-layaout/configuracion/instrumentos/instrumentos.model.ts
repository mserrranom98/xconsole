/*
export class ListaMoneda{
   constructor(
   public userName:string, 
    public peticion:string,    
    public lista:string,
    public adm:string
   
   )
   {}
}
*/

export class ListaInstrumento{
   constructor(
   public userName:string, 
   public peticion:string,
   public codigo:string    
   )
   {}
}

export class ListaInstrumento2{
   constructor(
   public userName:string, 
   public peticion:string,
   public codigo:string    
   )
   {}
}

export class FiltroIndustria{
   constructor(  
   public lista:string    
   )
   {}
}

export class FiltroIndustria2{
   constructor(  
   public lista:string    
   )
   {}
}

export class InstrumentosFiltros{
   constructor(
      public userName:string, 
      public peticion:string,     
      public empresa:string,
      public tipo:string,
      public interaccion:string,
      public bloqueado:string
   )
   {}

}

export class ListaInstrumento3{
   constructor(
   public userName:string, 
   public peticion:string,
   public instrumento:string    
   )
   {}
}

export class ListaInstrumentoFull{
   constructor(
   public userName:string, 
   public peticion:string,
   public empresa:string,
   public standIn:string,
   public tipo:string,
   public bloqueado:string
   )
   {}
}

/* EDITAR INSTRUMENTO */

export class EditarInstrumento{
   constructor(
   public userName:string, 
   public peticion:string,
   public instrumento:string,
   public tipo:string,
   public titulo:string,
   public empresa:string,
   public bloqueado:string,
   public control:string,
   public saf:string,
   public standIn:string
   )
   {}
}

/* EDITAR ATRIBUTO */


export class EditarAtributo{
   constructor(
   public userName:string, 
   public peticion:string,
   public instrumento: string,
   public atributo:string,
   public titulo:string,
   public tipo:string,
   public largoMax:number, //deberia ser long?
   public visible:string,
   public llave:string,
   public orden:string,
   public protegido:string,
   public opcional:string,
   public lista:string,
   public ordenImpresionTicket:string //deberia ser int?
   )
   {}
}

