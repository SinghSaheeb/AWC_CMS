using AWC_CMS.BO;
using AWC_CMS.GenBase;
using AWC_CMS.Repos;
using Microsoft.AspNetCore.Mvc;

namespace AWC_CMS.Controllers
{
    [Route("api/[controller]")]
    public class CoursesController(CourseRepo repo) : BaseApiController<CourseBO, CourseRepo>(repo) { }
}
