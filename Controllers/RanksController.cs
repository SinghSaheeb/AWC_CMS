using AWC_CMS.BO;
using AWC_CMS.GenBase;
using AWC_CMS.Repos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Threading.Tasks;

namespace AWC_CMS.Controllers
{
    [Route("api/[controller]")]
    public class RanksController(RankRepo repo) : BaseApiController<RankBO, RankRepo>(repo)
    {
        private readonly RankRepo _rankRepo = repo;

        [HttpGet("distinct-services")]
        public async Task<IActionResult> GetDistinctRankServices()
        {
            DataTable distinctServices = await _rankRepo.GetDistinctRankServicesAsync();
            var jsonResult = JsonConvert.SerializeObject(distinctServices);
            return Content(jsonResult, "application/json");
        }

        [HttpGet("distinct-types")]
        public async Task<IActionResult> GetDistinctRankTypesByService([FromQuery] string service)
        {
            DataTable distinctTypes = await _rankRepo.GetDistinctRankTypesByServiceAsync(service);
            var jsonResult = JsonConvert.SerializeObject(distinctTypes);
            return Content(jsonResult, "application/json");
        }

        [HttpGet("by-type")]
        public async Task<IActionResult> GetRanksByType([FromQuery] string type)
        {
            DataTable ranks = await _rankRepo.GetRanksByTypeAsync(type);
            var jsonResult = JsonConvert.SerializeObject(ranks);
            return Content(jsonResult, "application/json");
        }

        [HttpGet("by-type-and-service")]
        public async Task<IActionResult> GetRanksByTypeAndService([FromQuery] string type, [FromQuery] string service)
        {
            DataTable ranks = await _rankRepo.GetRanksByTypeAndServiceAsync(type, service);
            var jsonResult = JsonConvert.SerializeObject(ranks);
            return Content(jsonResult, "application/json");
        }
    }
}
