using Eleveight.Models.Domain.User;
using Eleveight.Models.Requests.App;
using Eleveight.Models.Requests.User;
using Eleveight.Models.Responses;
using Eleveight.Services;
using Eleveight.Services.App;
using Eleveight.Services.User;
using System;
using System.Web.Http;

namespace Eleveight.Web.Controllers.Api.User
{
    [RoutePrefix("api/user/usereducations")]
    public class UserEducationController : ApiController
    {
        private IUserEducationService _userEduService;
        private IUserService _userService;
        private IAppLogService _appLogService;
        private int _currentId;

        public UserEducationController(IUserEducationService userEduService, IUserService service, IAppLogService appLogService)
        {
            _userEduService = userEduService;
            _userService = service;
            _appLogService = appLogService;
            _currentId = _userService.GetCurrentUserId();
        }

        [Route(), HttpGet]
        public IHttpActionResult GetAll()
        {
            try
            {
                ItemsResponse<UserEducation> response = new ItemsResponse<UserEducation>();
                response.Items = _userEduService.ReadAll();
                return Ok(response);
            }
            catch (Exception ex)
            {
                int currentUser = _currentId;
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

        [Route("{id:int}"), HttpGet]
        public IHttpActionResult ReadById(int id)
        {
            try
            {
                ItemResponse<UserEducation> response = new ItemResponse<UserEducation>
                {
                    Item = _userEduService.ReadById(id)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                int currentUser = _currentId;
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

        [Route(), HttpPost]
        public IHttpActionResult Post(UserEducationAddRequest model)
        {
            try
            {

                if (!ModelState.IsValid) return BadRequest(ModelState);
                ItemResponse<int> response = new ItemResponse<int>
                {
                    Item = _userEduService.Insert(model)
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                int currentUser = _currentId;
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

        [Route("{id:int}"), HttpPut]
        public IHttpActionResult Put(UserEducationUpdateRequest model)
        {
            try
            {
                _userEduService.Update(model);
                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                int currentUser = _currentId;
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

        [Route("{id:int}"), HttpDelete]
        public IHttpActionResult Delete(int id)
        {
            try
            {
                _userEduService.DeleteById(id);
                return Ok(new SuccessResponse());
            }
            catch (Exception ex)
            {
                int currentUser = _currentId;
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

        [Route("userId"), HttpGet]
        [Route("userId/{id:int}")]
        public IHttpActionResult GetByUserId(int? id = null)
        {
            try
            {
                ItemsResponse<UserEducation> response = new ItemsResponse<UserEducation>();
                response.Items = _userEduService.ReadByUserId(id.HasValue ? id.Value : _currentId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                int currentUser = _currentId;
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
    }
}