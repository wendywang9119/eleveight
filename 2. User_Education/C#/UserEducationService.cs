using Eleveight.Models.Domain.User;
using Eleveight.Models.Requests.User;
using Eleveight.Services.Tools;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Eleveight.Services.User
{
    public class UserEducationService : BaseService, IUserEducationService
    {
        public List<UserEducation> ReadAll()
        {
            List<UserEducation> list = new List<UserEducation>();
            DataProvider.ExecuteCmd("dbo.UserEducation_SelectAll",
                inputParamMapper: null,
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    list.Add(DataMapper<UserEducation>.Instance.MapToObject(reader));
                });
            return list;
        }

        public UserEducation ReadById(int id)
        {
            UserEducation userEdu = new UserEducation();
            DataProvider.ExecuteCmd("dbo.UserEducation_SelectById",
               inputParamMapper: (SqlParameterCollection inputs) =>
               {
                   inputs.AddWithValue("@Id", id);
               },
               singleRecordMapper: (IDataReader reader, short resultSet) =>
               {
                   userEdu = DataMapper<UserEducation>.Instance.MapToObject(reader);
               });
            return userEdu;
        }

        public int Insert(UserEducationAddRequest model)
        {
            int returnValue = 0;

            DataProvider.ExecuteNonQuery("dbo.UserEducation_Insert",
               inputParamMapper: (SqlParameterCollection inputs) =>
               {
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@UserBaseId", model.UserBaseId, SqlDbType.Int));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@CurrentSemester", model.CurrentSemester, SqlDbType.NVarChar, 100));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@SchoolId", model.SchoolId, SqlDbType.Int));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@GPA", model.GPA, SqlDbType.Decimal));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@ReportCardFileUrl", model.ReportCardFileUrl, SqlDbType.NVarChar, 2000));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@CompletedUnits", model.CompletedUnits, SqlDbType.Decimal));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@EnrollmentDate", model.EnrollmentDate, SqlDbType.DateTime));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@ExpGradDate", model.ExpGradDate, SqlDbType.DateTime));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@Major", model.Major, SqlDbType.NVarChar, 100));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@Plan", model.Plan, SqlDbType.NVarChar, 100));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@SchoolIdNum", model.SchoolIdNum, SqlDbType.NVarChar, 50));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@SchoolIdPhotoFileUrl", model.SchoolIdPhotoFileUrl, SqlDbType.NVarChar, 2000));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@CreatedById", model.CreatedById, SqlDbType.Int));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@ModifiedById", model.ModifiedById, SqlDbType.Int));
                   inputs.Add(SqlDbParameter.Instance.BuildParameter("@UnitReportCardUrl", model.UnitReportCardUrl, SqlDbType.NVarChar, 200));

                   SqlParameter idOut = new SqlParameter("@Id", 0);
                   idOut.Direction = ParameterDirection.Output;

                   inputs.Add(idOut);
               },
               returnParameters: (SqlParameterCollection inputs) =>
               {
                   int.TryParse(inputs["@Id"].Value.ToString(), out returnValue);
               }
               );
            return returnValue;
        }

        public void Update(UserEducationUpdateRequest model)
        {
            DataProvider.ExecuteNonQuery("dbo.UserEducation_Update",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@Id", model.Id, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@UserBaseId", model.UserBaseId, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@CurrentSemester", model.CurrentSemester, SqlDbType.NVarChar, 100));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@SchoolId", model.SchoolId, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@GPA", model.GPA, SqlDbType.Decimal));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@ReportCardFileUrl", model.ReportCardFileUrl, SqlDbType.NVarChar, 2000));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@CompletedUnits", model.CompletedUnits, SqlDbType.Decimal));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@EnrollmentDate", model.EnrollmentDate, SqlDbType.DateTime));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@ExpGradDate", model.ExpGradDate, SqlDbType.DateTime));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@Major", model.Major, SqlDbType.NVarChar, 100));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@Plan", model.Plan, SqlDbType.NVarChar, 100));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@SchoolIdNum", model.SchoolIdNum, SqlDbType.NVarChar, 50));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@SchoolIdPhotoFileUrl", model.SchoolIdPhotoFileUrl, SqlDbType.NVarChar, 2000));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@CreatedById", model.CreatedById, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@ModifiedById", model.ModifiedById, SqlDbType.Int));
                    inputs.Add(SqlDbParameter.Instance.BuildParameter("@UnitReportCardUrl", model.UnitReportCardUrl, SqlDbType.NVarChar, 200));

                });
        }

        public void DeleteById(int id)
        {
            DataProvider.ExecuteNonQuery("dbo.UserEducation_Delete",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.AddWithValue("@Id", id);
                });
        }

        public List<UserEducation> ReadByUserId(int id)
        {
            List<UserEducation> list = new List<UserEducation>();
            DataProvider.ExecuteCmd("dbo.UserEducation_SelectByUserId",
                inputParamMapper: (SqlParameterCollection inputs) =>
                {
                    inputs.AddWithValue("@UserBaseId", id);
                },
                singleRecordMapper: (IDataReader reader, short resultSet) =>
                {
                    list.Add(DataMapper<UserEducation>.Instance.MapToObject(reader));
                });
            return list;
        }
    }
}