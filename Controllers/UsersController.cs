using AWC_CMS.BO;
using AWC_CMS.GenBase;
using AWC_CMS.Repos.Account;
using Microsoft.AspNetCore.Mvc;

namespace AWC_CMS.Controllers
{
    [Route("api/[controller]")]
    public class UsersController(UserRepo repo) : BaseApiController<UserBO, UserRepo>(repo) { }
}
