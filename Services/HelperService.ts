


export default function formatPhone(input : any)  {
    // إزالة كل شيء غير الأرقام
    const digits = input.replace(/\D/g, "");

    // إذا لم يكن الرقم 10 خانات، نرجعه كما هو
    if (digits.length !== 10) return input;

    // تنسيق الرقم بالشكل المطلوب
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };