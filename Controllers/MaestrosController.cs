using AWC_CMS.BO;
using AWC_CMS.Repos.Master;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Threading.Tasks;

namespace AWC_CMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaestrosController(MaestroRepo maestroRepo) : ControllerBase
    {
        private readonly MaestroRepo _maestroRepo = maestroRepo;

        [HttpGet]
        public async Task<IActionResult> GetMaestro([FromQuery] MaestroBO obj)
        {
            DataTable maestroRecords = await _maestroRepo.GetMaestro(obj);
            var jsonResult = JsonConvert.SerializeObject(maestroRecords);
            return Content(jsonResult, "application/json");
        }

        [HttpGet("dbset")]
        public async Task<IActionResult> GetMaestroDbSet([FromQuery] MaestroBO obj)
        {
            DataTable maestroRecords = await _maestroRepo.GetMaestroDbSet(obj);
            var jsonResult = JsonConvert.SerializeObject(maestroRecords);
            return Content(jsonResult, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> AddMaestroValue([FromBody] MaestroBO maestro)
        {
            if (maestro == null)
            {
                return BadRequest("Maestro data cannot be null.");
            }

            var result = await _maestroRepo.AddValueToMaestroDbSet(maestro);

            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateMaestroValue([FromBody] MaestroBO maestro)
        {
            if (maestro == null)
            {
                return BadRequest("Maestro data cannot be null.");
            }

            var result = await _maestroRepo.UpdateValueInMaestroDbSet(maestro);

            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMaestroValue([FromBody] MaestroBO maestro)
        {
            if (maestro == null || maestro.Id == null)
            {
                return BadRequest("Maestro data cannot be null and must include an Id.");
            }

            var result = await _maestroRepo.DeleteValueInMaestroDbSet(maestro); // Ensure you implement this method in MaestroRepo

            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result.Message);
            }
        }
    }
}
