using System.Threading.Tasks;
using MediConnect.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediConnect.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly IAiServiceClient _aiServiceClient;

        public AiController(IAiServiceClient aiServiceClient)
        {
            _aiServiceClient = aiServiceClient;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> MedicalChat([FromBody] ChatRequest request)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            try
            {
                var result = await _aiServiceClient.GetChatResponseAsync(request, token);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error calling AI service", details = ex.Message });
            }
        }

        [HttpPost("appointment")]
        public async Task<IActionResult> AppointmentAssistant([FromBody] ChatRequest request)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            try
            {
                var result = await _aiServiceClient.GetAppointmentAssistanceAsync(request, token);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Error calling AI service", details = ex.Message });
            }
        }
    }
}
