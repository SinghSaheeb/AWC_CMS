using AWC_CMS.BO.Deployment;
using AWC_CMS.GenBase;
using AWC_CMS.Repos.Deployment;
using Microsoft.AspNetCore.Mvc;

namespace AWC_CMS.Controllers.Deployment
{
    [Route("api/deployment/[controller]")]
    public class StudentsController(StudentRepo repo) : BaseApiController<StudentBO, StudentRepo>(repo) { }
}