using AWC_CMS.BO;
using AWC_CMS.GenBase;
using AWC_CMS.Repos.Master;
using Microsoft.AspNetCore.Mvc;

namespace AWC_CMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlocksController(BlockRepo repo) : BaseApiController<BlockBO, BlockRepo>(repo) { }
}
