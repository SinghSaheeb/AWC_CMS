using AWC_CMS.BO;
using AWC_CMS.GenBase;
using AWC_CMS.Repos.Account;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AWC_CMS.Controllers
{
    [Route("api/[controller]")]
    public class UsersController(UserRepo repo) : BaseApiController<UserBO, UserRepo>(repo) 
    {
       private readonly UserRepo _repo = repo;

        [HttpPut("update-user-pwd")]
        public async Task<IActionResult> UpdateUserPassword ([FromBody] UserBO obj)
        {
            if (obj == null)
            {
                return BadRequest("Data cannot be null.");
            }

            var result = await _repo.UpdateUserPassword(obj);
            return result.Success ? Ok(result) : BadRequest(result.Message);
        }
    }
}
