using Eleveight.Models.Domain.User;
using Eleveight.Models.Requests.App;
using Eleveight.Models.Responses;
using Eleveight.Services;
using Eleveight.Services.App;
using Eleveight.Services.User;
using System;
using System.Web.Http;

namespace Eleveight.Web.Controllers.Api.User
{
    [RoutePrefix("api/user/users")]
    public class UserManagmemtController : ApiController
    {
        private IUserManagementService _userManagementService;
        private IAppLogService _appLogService;
        private IUserService _userService;

        public UserManagmemtController(IUserManagementService userManagementService, IAppLogService appLogService, IUserService userService)
        {
            _userManagementService = userManagementService;
            _appLogService = appLogService;
            _userService = userService;
        }

        [Route(), HttpGet]
        [Route("{pgNum:int}")]
        public IHttpActionResult GetAll(int pgNum = 1)
        {
            try
            {
                ItemsResponse<UserManagement> response = new ItemsResponse<UserManagement>();
                response.Items = _userManagementService.ReadAll(pgNum);
                return Ok(response);
            }
            catch (Exception ex)
            {
                int currentUser = _userService.GetCurrentUserId();
                _appLogService.Insert(new AppLogAddRequest
                {
                    AppLogTypeId = 1,
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    Title = "Error in " + GetType().Name + " " + System.Reflection.MethodBase.GetCurrentMethod().Name,
                    UserBaseId = currentUser
                });

                return BadRequest(ex.Message);
            }
        }

        [Route("groupid/{id:int}"), HttpGet]
        public IHttpActionResult getByGroupId(int id)
        {
            try
            {
                ItemsResponse<UserManagement> response = new ItemsResponse<UserManagement>();
                response.Items = _userManagementService.ReadByGroup(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}