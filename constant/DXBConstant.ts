export const rooturl = 'https://old.landsdxb.com';
const baseurl        = 'https://old.landsdxb.com/api/';

export const CACHE_KEY_DropDownMenu  = 'dropdownMenus';
export const DROPDOWN_CACHE_KEY = 'dropdown_cache';
export const DROPDOWN_DATE_KEY = 'dropdown_last_updated';

export const Constant = {    
   policyservice: baseurl +'EvaluatorManagePolicy/' ,  
};


export const e = 10.764;

export const getpolicy_api                = baseurl + 'EvaluatorManagePolicy/getpolicy';
export const get_LastDrpDownModified_api  = baseurl + 'EvaluatorManagePolicy/GetLastDrpDownModified';
export const get_options_api              = baseurl + 'EvaluatorManagePolicy/opt';

 
 // areaname api
export const areaname_api          = baseurl + 'EvaluatorManagePolicy/GetAreaNameList';
export const creatarea_api         = baseurl + 'EvaluatorManagePolicy/creatareaname';
export const updatearea_api        = baseurl + 'EvaluatorManagePolicy/updateareaname'; 
export const deactivearea_api      = baseurl + 'EvaluatorManagePolicy/DeactiveArea';
export const activearea_api        = baseurl + 'EvaluatorManagePolicy/ActiveAreaName';
export const deletearea_api        = baseurl + 'EvaluatorManagePolicy/DeleteAreaName';

// purpose api
export const purpose_api           = baseurl + 'EvaluatorManagePolicy/GetPurposeList';
export const creatpurpose_api      = baseurl + 'EvaluatorManagePolicy/creatpurpose';
export const updatepurpose_api     = baseurl + 'EvaluatorManagePolicy/updatepurpose';
export const deactivepurpose_api   = baseurl + 'EvaluatorManagePolicy/DeactivePurpose';
export const activepurpose_api     = baseurl + 'EvaluatorManagePolicy/ActivePurpose';
export const deletepurpose_api     = baseurl + 'EvaluatorManagePolicy/DeletePurpose';

// usageland api
export const usageland_api         = baseurl + 'EvaluatorManagePolicy/GetUsageList';
export const creatusageland_api    = baseurl + 'EvaluatorManagePolicy/creatusage';
export const updateusageland_api   = baseurl + 'EvaluatorManagePolicy/updateusage';
export const deactiveusageland_api = baseurl + 'EvaluatorManagePolicy/DeactiveUsage';
export const activeusageland_api   = baseurl + 'EvaluatorManagePolicy/ActiveUsage';
export const deleteusageland_api   = baseurl + 'EvaluatorManagePolicy/DeleteUsage';

// mainproject api
export const mainproject_api         = baseurl + 'EvaluatorManagePolicy/GetMainprojectList';
export const creatmainproject_api    = baseurl + 'EvaluatorManagePolicy/creatmainproject';
export const updatemainproject_api   = baseurl + 'EvaluatorManagePolicy/updatemainproject';
export const deactivemainproject_api = baseurl + 'EvaluatorManagePolicy/DeactiveMainProject';
export const activemainproject_api   = baseurl + 'EvaluatorManagePolicy/ActiveMainProject';
export const deletemainproject_api   = baseurl + 'EvaluatorManagePolicy/DeleteMainProject';

// subproject api
export const subproject_api         = baseurl + 'EvaluatorManagePolicy/GetSubprojectList';
export const creatsubproject_api    = baseurl + 'EvaluatorManagePolicy/creatsubproject';
export const updatesubproject_api   = baseurl + 'EvaluatorManagePolicy/updatesubproject'; 
export const deactivesubproject_api = baseurl + 'EvaluatorManagePolicy/DeactiveSubProject';
export const activesubproject_api   = baseurl + 'EvaluatorManagePolicy/ActiveSubProject';
export const deletesubproject_api   = baseurl + 'EvaluatorManagePolicy/DeleteSubProject';

// buildbase api
export const buildbase_api         = baseurl + 'EvaluatorManagePolicy/GetBaseEvaluateList';
export const creatbuildbase_api    = baseurl + 'EvaluatorManagePolicy/creatbaseevaluate';
export const updatebuildbase_api   = baseurl + 'EvaluatorManagePolicy/updatebaseevaluate';
export const deactivebuildbase_api = baseurl + 'EvaluatorManagePolicy/DeactiveBaseEvaluate';
export const activebuildbase_api   = baseurl + 'EvaluatorManagePolicy/ActiveBaseEvaluate';
export const deletebuildbase_api   = baseurl + 'EvaluatorManagePolicy/DeleteBaseEvaluate';

// landstatus api
export const landstatus_api         = baseurl + 'EvaluatorManagePolicy/GetLandstatusList';
export const creatlandstatus_api    = baseurl + 'EvaluatorManagePolicy/creatlandstatus';
export const updatelandstatus_api   = baseurl + 'EvaluatorManagePolicy/updatelandstatus'; 
export const deactivelandstatus_api = baseurl + 'EvaluatorManagePolicy/DeactiveLandStatus';
export const activelandstatus_api   = baseurl + 'EvaluatorManagePolicy/ActiveLandStatus';
export const deletelandstatus_api   = baseurl + 'EvaluatorManagePolicy/DeleteLandStatus';

// Buildtype api
export const buildtype_api         = baseurl + 'EvaluatorManagePolicy/GetBuildtypeList';
export const creatbuildtype_api    = baseurl + 'EvaluatorManagePolicy/creatbuildtype';
export const updatebuildtype_api   = baseurl + 'EvaluatorManagePolicy/updatebuildtype';
export const deactivebuildtype_api = baseurl + 'EvaluatorManagePolicy/DeactiveBuildType';
export const activebuildtype_api   = baseurl + 'EvaluatorManagePolicy/ActiveBuildType';
export const deletebuildtype_api   = baseurl + 'EvaluatorManagePolicy/DeleteBuildType';
 
// ApplicantInfo api
export const applincantinfo_api         = baseurl + 'EvaluatorManagePolicy/GetApplicantinfoList';
export const creatapplincantinfo_api    = baseurl + 'EvaluatorManagePolicy/creatApplicantinfo';
export const updateapplincantinfo_api   = baseurl + 'EvaluatorManagePolicy/updateApplicantinfo';
export const deleteapplincantinfo_api   = baseurl + 'EvaluatorManagePolicy/DeleteApplicantinfo';
 
// PolicyPrice api 
export const policyprice_api         = baseurl + 'EvaluatorManagePolicy/GetPricePolicyList';
export const creatpolicyprice_api    = baseurl + 'EvaluatorManagePolicy/creatpricepolicy';
export const updatepolicyprice_api   = baseurl + 'EvaluatorManagePolicy/updatepricepolicy';
export const deactivepolicyprice_api = baseurl + 'EvaluatorManagePolicy/DeactivePricePolicy';
export const activepolicyprice_api   = baseurl + 'EvaluatorManagePolicy/ActivePricePolicy';
export const deletepolicyprice_api   = baseurl + 'EvaluatorManagePolicy/DeletePolicyPrice';

// systemform api
export const systemform_api          = baseurl + 'EvaluatorManagePolicy/GetSystemformList'; 
export const activesystemform_api    = baseurl + 'EvaluatorManagePolicy/ActiveSystemForm';
export const deactivesystemform_api  = baseurl + 'EvaluatorManagePolicy/DeactiveSystemForm';
 
// Menu api
export const menu_api                = baseurl + 'EvaluatorManagePolicy/GetMenuList';
export const getmenu_api             = baseurl + 'EvaluatorManagePolicy/GetMenu';
export const creatmenu_api           = baseurl + 'EvaluatorManagePolicy/CreateMenu';
export const updatemenu_api          = baseurl + 'EvaluatorManagePolicy/UpdateMenu';
export const deactivemenu_api        = baseurl + 'EvaluatorManagePolicy/DeactiveMenu';
export const activemenu_api          = baseurl + 'EvaluatorManagePolicy/ActiveMenu';
export const deletemenu_api          = baseurl + 'EvaluatorManagePolicy/DeleteMenu';

// Users api
export const users_api               = baseurl + 'EvaluatorManagePolicy/GetUsersList';
export const getuser_api             = baseurl + 'EvaluatorManagePolicy/GetUser';
export const creatusers_api          = baseurl + 'EvaluatorManagePolicy/CreateUser';
export const updateusers_api         = baseurl + 'EvaluatorManagePolicy/UpdateUser';
export const deactiveusers_api       = baseurl + 'EvaluatorManagePolicy/DeactiveUser';
export const activeusers_api         = baseurl + 'EvaluatorManagePolicy/ActiveUser';
export const deleteusers_api         = baseurl + 'EvaluatorManagePolicy/DeleteUser';

// ReportInvoice api
export const reportinvoice_api         = baseurl + 'EvaluatorManagePolicy/GetReportInvoiceList';
export const getreportinvoice_api      = baseurl + 'EvaluatorManagePolicy/EditReportInvoice';
export const creatreportinvoice_api    = baseurl + 'EvaluatorManagePolicy/AddReportInvoice';
export const updatereportinvoice_api   = baseurl + 'EvaluatorManagePolicy/EditReportInvoice';
export const deletereportinvoice_api   = baseurl + 'EvaluatorManagePolicy/DeleteReportInvoice';

export const getinvoicepolicy_api     = baseurl + 'EvaluatorManagePolicy/GetInvoicePolicy';
export const getpolicytype_api        = baseurl + 'EvaluatorManagePolicy/GetPolicyType';
export const getevaluationtype_api    = baseurl + 'EvaluatorManagePolicy/GetEvaluationType'; 
export const getpolicylist_api        = baseurl + 'EvaluatorManagePolicy/ListPolices';

// OfferPrice api
export const offerprice_api           = baseurl + 'EvaluatorManagePolicy/GetOfferPriceList';
export const getofferprice_api        = baseurl + 'EvaluatorManagePolicy/EditQuotation';
export const creatofferprice_api      = baseurl + 'EvaluatorManagePolicy/AddQuotation';
export const updateofferprice_api     = baseurl + 'EvaluatorManagePolicy/EditQuotation';
export const deleteofferprice_api     = baseurl + 'EvaluatorManagePolicy/DeleteOfferPrice';

// PolicyLand api
export const policyland_api            = baseurl + 'EvaluatorManagePolicy/GetPolicyLandList';
export const deletepolicyland_api      = baseurl + 'EvaluatorManagePolicy/DeletePolicyLand';

export const getvlandpolicy_api         = baseurl + 'EvaluatorManagePolicy/GetVacantLandPolicy';
export const getbuildingpolicy_api      = baseurl + 'EvaluatorManagePolicy/GetBuildingPolicy';
export const getunitpolicy_api          = baseurl + 'EvaluatorManagePolicy/GetUnitPolicy';
export const getofficepolicy_api        = baseurl + 'EvaluatorManagePolicy/GetOfficePolicy';
export const getshoppolicy_api          = baseurl + 'EvaluatorManagePolicy/GetShopPolicy';
export const getunderconstpolicy_api    = baseurl + 'EvaluatorManagePolicy/GetUnderConstPolicy';
export const getvillapolicy_api         = baseurl + 'EvaluatorManagePolicy/GetVillaPolicy';

export const updatevlandpolicy_api      = baseurl + 'EvaluatorManagePolicy/UpdateVacantLandPolicy';
export const updatebuildingpolicy_api   = baseurl + 'EvaluatorManagePolicy/UpdateBuildingPolicy';
export const updateunitpolicy_api       = baseurl + 'EvaluatorManagePolicy/UpdateUnitPolicy';
export const updateofficpolicy_api      = baseurl + 'EvaluatorManagePolicy/UpdateOfficePolicy';
export const updateshoppolicy_api       = baseurl + 'EvaluatorManagePolicy/UpdateShopPolicy';
export const updateunderconstpolicy_api = baseurl + 'EvaluatorManagePolicy/UpdateUnderConstPolicy';
export const updatevillapolicy_api      = baseurl + 'EvaluatorManagePolicy/UpdateVillaPolicy';

export const creatvlandpolicy_api      = baseurl + 'EvaluatorManagePolicy/CreateVacantLandPolicy';
export const creatbuildingpolicy_api   = baseurl + 'EvaluatorManagePolicy/CreateBuildingPolicy';
export const creatunitpolicy_api       = baseurl + 'EvaluatorManagePolicy/CreateUnitPolicy';
export const creatofficepolicy_api     = baseurl + 'EvaluatorManagePolicy/CreateOfficePolicy';
export const creatshoppolicy_api       = baseurl + 'EvaluatorManagePolicy/CreateShopPolicy';
export const creatunderconstpolicy_api = baseurl + 'EvaluatorManagePolicy/CreateUnderConstPolicy';
export const creatvillapolicy_api      = baseurl + 'EvaluatorManagePolicy/CreateVillaPolicy';

// FormLand api
export const evaformland_api           = baseurl + 'EvaluatorManagePolicy/GetFormLandList';
export const clerkformland_api         = baseurl + 'EvaluatorManagePolicy/GetClerkFormList';
export const invoiceformland_api       = baseurl + 'EvaluatorManagePolicy/GetInvoiceFormList';


export const deleteformland_api      = baseurl + 'EvaluatorManagePolicy/DeleteFormLand';
  
export const getvlandform_api        = baseurl + 'EvaluatorManagePolicy/GetVacantLandForm';
export const getbuildingform_api     = baseurl + 'EvaluatorManagePolicy/GetBuildingForm';
export const getunitform_api         = baseurl + 'EvaluatorManagePolicy/GetUnitForm';
export const getofficeform_api       = baseurl + 'EvaluatorManagePolicy/GetOfficeForm';
export const getshopform_api         = baseurl + 'EvaluatorManagePolicy/GetShopForm';
export const getunderconstform_api   = baseurl + 'EvaluatorManagePolicy/GetUnderConstForm';
export const getvillaform_api        = baseurl + 'EvaluatorManagePolicy/GetVillaForm';

export const evaluatevlandform_api      = baseurl + 'EvaluatorManagePolicy/EvaluateVacantLandForm';
export const evaluatebuildingform_api   = baseurl + 'EvaluatorManagePolicy/EvaluateBuildingForm';
export const evaluateunitform_api       = baseurl + 'EvaluatorManagePolicy/EvaluateUnitForm';
export const evaluateofficeform_api     = baseurl + 'EvaluatorManagePolicy/EvaluateOfficeForm';
export const evaluateshopform_api       = baseurl + 'EvaluatorManagePolicy/EvaluateShopForm';
export const evaluateunderconstform_api = baseurl + 'EvaluatorManagePolicy/EvaluateUnderConstForm';
export const evaluatevillaform_api      = baseurl + 'EvaluatorManagePolicy/EvaluateVillaForm';

export const creatvlandform_api        = baseurl + 'EvaluatorManagePolicy/CreateVacantLandForm';
export const creatbuildingform_api     = baseurl + 'EvaluatorManagePolicy/CreateBuildingForm';
export const creatunitform_api         = baseurl + 'EvaluatorManagePolicy/CreateUnitForm';
export const creatofficeform_api       = baseurl + 'EvaluatorManagePolicy/CreateOfficeForm';
export const creatshopform_api         = baseurl + 'EvaluatorManagePolicy/CreateShopForm';
export const creatunderconstform_api   = baseurl + 'EvaluatorManagePolicy/CreateUnderConstForm';
export const creatvillaform_api        = baseurl + 'EvaluatorManagePolicy/CreateVillaForm';
   
// Goverment Tax api
export const govermenttax_api           = baseurl + 'EvaluatorManagePolicy/getgovermenttax';
export const updategovermenttax_api     = baseurl + 'EvaluatorManagePolicy/updategovermenttax';
export const deactivegovermenttax_api   = baseurl + 'EvaluatorManagePolicy/DeactiveGovermentTax';
export const activegovermenttax_api     = baseurl + 'EvaluatorManagePolicy/ActiveGovermentTax';

export const dashboard_api               = baseurl + 'EvaluatorManagePolicy/GetDashboard';
export const getrole_api                 = baseurl + 'EvaluatorManagePolicy/getroles';
export const active_areaname_api         = baseurl + 'EvaluatorManagePolicy/GetAreaNameActiveList';
 
export const print_taxinvoice_api      = baseurl + 'EvaluatorManagePolicy/PrintTaxInvoice';
export const print_invoice_api         = baseurl + 'EvaluatorManagePolicy/PrintInvoice';
export const print_certificate_api     = baseurl + 'EvaluatorManagePolicy/PrintCertificate';

export const download_picture_api       = baseurl + 'EvaluatorManagePolicy/DownloadAttach';

export const login_api                  = baseurl + 'Account/login';
export const logout_api                 = baseurl + 'Account/Logout';
export const refreshtoken_api           = baseurl + 'Account/refresh'; 
export const editprofile_api            = baseurl + 'Account/UpdateProfile';

