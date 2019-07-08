 
export class ListaMoneda{
    constructor(
    public userName:string, 
     public peticion:string,    
     public lista:string,
     public adm:string
    
    )
    {}
 }
 
 
 export class ObtenerTipoCambio{
    constructor(
     public peticion:string,  
     public userName:string,    
     public fecha_desde:any,
     public fecha_hasta:any,
     public moneda:string   
    )
    {}
 }
 
 export class CrearTipoCambio{
     constructor(
      public peticion:string,  
      public userName:string,       
      public fecha_desde:any,
      public fecha_hasta:any,
      public moneda:string,
      public valor:string
     )
     {}
  }
 
  export class ActualizarTipoCambio{
     constructor(
      public peticion:string,  
      public userName:string,
      public id:string,
      public fecha_desde:any,
      public fecha_hasta:any,
      public moneda:string,
      public valor:string
     )
     {}
  }
 
  export class BorrarTipoCambio{
     constructor(
      public peticion:string,
      public userName:string,  
      public id:string,    
     )
     {}
  }
 
  export class CargaMasivaTipoCambio{
    constructor(
     public peticion:string,  
     public userName:string,
     public archivo:any,
     public moneda:string
    )
    {}
 }
 