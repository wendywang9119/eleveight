using Eleveight.Data.Structured;
using Eleveight.Models.Domain.Clients;
using Eleveight.Models.Requests.Clients;
using Eleveight.Services.Tools;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Eleveight.Services.Clients
{
    public class CMDashboardContactService : BaseService, ICMDashboardContactService
    {
        public CMDashboardContact ReadByUserId(int id)
        {
            CMDashboardContact result = new CMDashboardContact();
            List<ContactPhone> contactPhone = new List<ContactPhone>();
            List<ContactEmail> contactEmail = new List<ContactEmail>();
            List<ContactSocialMedia> contactSocialMedia = new List<ContactSocialMedia>();
            DataProvider.ExecuteCmd("CMDashboardContact_SelectByUserId",
                inputParamMapper: (SqlParameterCollection inputs) =>
                 {
                     inputs.AddWithValue("@UserBaseId", id);
                 },
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                 {
                     if (resultSet == 0)
                     {
                         contactPhone.Add(DataMapper<ContactPhone>.Instance.MapToObject(reader));
                     }
                     else if (resultSet == 1)
                     {
                         contactEmail.Add(DataMapper<ContactEmail>.Instance.MapToObject(reader));
                     }
                     else if (resultSet == 2)
                     {
                         contactSocialMedia.Add(DataMapper<ContactSocialMedia>.Instance.MapToObject(reader));
                     }
                 });
            result.ContactPhone = contactPhone;
            result.ContactEmail = contactEmail;
            result.ContactSocialMedia = contactSocialMedia;
            return result;
        }

        public void Update(CMDashboardContactUpdateRequest model)
        {
            DataProvider.ExecuteNonQuery("CMDashboardContact_Update",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    SqlParameter contactPhone = new SqlParameter("@PhoneData", SqlDbType.Structured);
                    SqlParameter contactEmail = new SqlParameter("@EmailData", SqlDbType.Structured);
                    SqlParameter contactSocial = new SqlParameter("@SocialData", SqlDbType.Structured);
                    contactPhone.Value = new GenericTable<ContactPhoneUpdateRequest>(model.Phones);
                    contactEmail.Value = new GenericTable<ContactEmailUpdateRequest>(model.Emails);
                    contactSocial.Value = new GenericTable<ContactSocialUpdateRequest>(model.SocialMedias);
                    inputs.Add(contactPhone);
                    inputs.Add(contactEmail);
                    inputs.Add(contactSocial);
                });
        }
    }
}