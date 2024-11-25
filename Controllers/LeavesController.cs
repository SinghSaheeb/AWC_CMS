using AWC_CMS.BO;
using AWC_CMS.GenBase;
using AWC_CMS.Repos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AWC_CMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeavesController(LeaveRepo repo) : BaseApiController<LeaveBO, LeaveRepo>(repo) { }
    
}
