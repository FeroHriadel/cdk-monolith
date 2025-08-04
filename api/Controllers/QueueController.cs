using Api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Api.Dtos;

namespace Api.Controllers;



public class QueueController(IQueueService queueService) : BaseApiController
{
  [HttpPost("publish")]
  public IActionResult PublishMessage([FromBody] QueueMessage message)
  {
    if (string.IsNullOrWhiteSpace(message.Message))
    {
      return BadRequest("Message cannot be empty.");
    }
    queueService.Publish(message.Message);
    return Ok("Message published successfully.");
  }

}