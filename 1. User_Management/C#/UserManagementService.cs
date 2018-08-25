using Eleveight.Models.Domain.User;
using Eleveight.Models.Requests.User;
using Eleveight.Services.Tools;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Eleveight.Services.User
{
    public class UserManagementService : BaseService, IUserManagementService
    {
        public List<UserManagement> ReadAll(int pgNum)
        {
            List<UserManagement> list = new List<UserManagement>();
            DataProvider.ExecuteCmd("dbo.SelectAllUsers",
               inputParamMapper: (SqlParameterCollection inputs) =>
               {
                   inputs.AddWithValue("@PageNumber", pgNum);
               },
               singleRecordMapper: (IDataReader reader, short resultSet) =>
               {
                   list.Add(DataMapper<UserManagement>.Instance.MapToObject(reader));
               });

            return list;
        }

        public List<UserManagement> ReadByGroup(int id)
        {
            List<UserManagement> list = new List<UserManagement>();
            DataProvider.ExecuteCmd("dbo.SelectAllUserByGroup",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.AddWithValue("@OrganizationUserGroupId", id);
                },
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                 {
                     list.Add(DataMapper<UserManagement>.Instance.MapToObject(reader));
                 });

            return list;
        }
    }
}