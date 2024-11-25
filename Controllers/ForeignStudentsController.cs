using AWC_CMS.BO.PersonalServiceParticular;
using AWC_CMS.GenBase;
using AWC_CMS.Repos.PersonalServiceParticular;
using Microsoft.AspNetCore.Mvc;

namespace AWC_CMS.Controllers
{
    [Route("api/[controller]")]
    public class ForeignStudentsController(ForeignStudentRepo repo) : BaseApiController<ForeignStudentBO, ForeignStudentRepo>(repo) { }
}
