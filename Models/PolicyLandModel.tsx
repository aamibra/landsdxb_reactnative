
export type CommonFormPolicyModel = {
  // Applicant Section
  applicantname: string;              // assuming required
  applicantmobile: string;
  applicantemail: string;
  deliveryaddress: string;
  applicanttrn: string ;
  typeofvaluation: number ;
  purpose: number ;
  // RealEstate Section
  areaname: number ;
  plotnumber: string ;
  municipaltynumber?: string ;
  areasize: string ;
  arearatio: string ;
  categoryownland: number ;
  landtypeno: number ;
  usage: number ;
  height: string ;
  // Evaluation Section
  isshownote: boolean;
  note: string ;
  certificatenote: string ;

};

export type  IOSPolicyModel  = CommonFormPolicyModel & {
  unitNumber: string;
  projectName: number ;
  subProject: number ;
  completionDate: string;
  buildingNumber: string;
  numberOfFloors: string;
  unitStatus: number;
  isRented: number;
  rentValue: string;
  sizeUnit: string; 
};


export type  CreateVLandPolicyModel  = CommonFormPolicyModel & {
  areaprice : string ;    
  grossvalue: string ;   
  efratio   : string ;      
};


export type CreateBuildingPolicyModel  = CommonFormPolicyModel & {  	   
  buildbaseevaluat: number ;         
  buildingtype: number ;              
  buildingareasize: string ;          
  buildingage: string ;                
  numberunite: string ;               
  numberfloor: string ;               
  numberroomlabor: string ;           
  annualrent: string ;               
  landareaprice: string ;            
  efratio: string ;                  
  landareagrossvalue: string ;       
  buildareaprice: string ;           
  buildareagrossvalue: string ;      
  percentcost: string ;              
  costrealestate: string ;           
  incomepercent: string ;            
  incomegrossery: string ;           
  comparerealestate: string ;        
  selectedvalue: string ;            
  selectedgroup: number;                    
  modification_reason: string ; 

};
 
export type CreateUnitPolicyModel  =  IOSPolicyModel & {
  areaprice: string ;
  grossvalue: string ;
  efratio: string ; 
 };
 
export type CreateOfficePolicyModel = CreateUnitPolicyModel & {
   isfloorrooffinishes: boolean  ; 
};

export type CreateShopPolicyModel    = CreateOfficePolicyModel & {
  shoptype: number ;
  percent: string ;
  expectedincome: string ;
  incomepercent: string;
  incomegrossery: string; 
};


export type CreateUnderConstPolicyModel = CreateBuildingPolicyModel & {
  percentcompletion: string;
  percentrealestatevalue: string ;
 // consultantletterid: number ;
 // consultantletterimg: string ;
 // consultantletterexttype: number;
 // consultantlettername: string ; 
};
 
export type CreateVillaPolicyModel =  CreateBuildingPolicyModel & {};
 
export interface ResultObjectModel<T> {
  succeeded: boolean;
  result   : T;
  errors   : string;
  errorcode: number;
}