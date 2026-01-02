import { convertToLocalDateString } from "./DateConverter";

const refractorAllUser = async (data) => {
    return data.map((user) => ({
        id: user._id,
        name: user.profile?.name || 'N/A',
        identifier: {
            type: user.contact ? 'contact' : 'email',
            value: user.contact ? user.contact : user.email || 'N/A',
        },
        isActive:user.isActive,
        area:user?.area
    }));
}

const refractorUserDetails = async (user) => {
    return ({
        id: user._id,
        name: user.profile?.name || '',
        email: user.email || '',
        contact: user.contact || '',
        dob: user.profile?.dob && convertToLocalDateString(user.profile?.dob),
        gender: user.profile?.gender || '',
        bloodGroup: user.profile?.bloodGroup || '',
        address: user.profile?.address || '',
        workAddress: user.profile?.workAddress || '',
        weight:user.profile?.weight || '',
        lastDonationDate: user.profile?.lastDonationDate && convertToLocalDateString(user.profile?.lastDonationDate),
        area:user.area?._id ,
        isActive:user.isActive,
        referral:user?.profile?.referral,
    });
}

const refractrUpdateUser =async (user) => {
  const payload = {};

  Object.entries(user).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      payload[key] = value;
    }
  });

  return payload;
};

const refracorReferalData = async (data)=>{

  return data.map((user)=> ({
    id:user._id,
    name:user.profile?.name,
    email:user.email,
    contact:user.contact
  }));
}


export {refractorAllUser, refractorUserDetails, refractrUpdateUser ,refracorReferalData}