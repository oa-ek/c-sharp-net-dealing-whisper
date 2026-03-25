using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Whisper.Application.DTOs.ChatDTOs;
using Whisper.Application.Interfaces.Services;

namespace Whisper.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatsController : ControllerBase
    {
        private readonly IChatService _chatService;
        public ChatsController(IChatService chatService)
        {
            _chatService = chatService;
        }
        [HttpGet("list")]
        public async Task<IActionResult> GetList()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _chatService.GetAllAsync(userId));
        }

        [HttpGet("{chatId}")]
        public async Task<IActionResult> GetChat(string chatId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _chatService.GetByIdAsync(userId, chatId));
        }

        [HttpPatch("{chatId}")]
        public async Task<IActionResult> PatchChat(string chatId, [FromBody] ChatUpdateDto updatedChat)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            updatedChat.Id = chatId;
            return Ok(await _chatService.EditAsync(userId, updatedChat));
        }

        [HttpDelete("{chatId}")]
        public async Task<IActionResult> DeleteChat(string chatId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _chatService.RemoveAsync(userId, chatId));
        }

        [HttpGet("{chatId}/get-members")]
        public async Task<IActionResult> GetMembers(string chatId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _chatService.GetParticipantsAsync(userId, chatId));
        }

        [HttpGet("{chatId}/messages")]
        public async Task<IActionResult> GetMessages(string chatId, [FromQuery] int limit, [FromQuery] int offset)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _chatService.GetMessagesAsync(userId, chatId, limit, offset));
        }

        [HttpPost("create/{receiverId}")]
        public async Task<IActionResult> CreateChat(string receiverId, [FromBody] ChatCreateDto chat)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(await _chatService.CreateChatAsync(userId, receiverId, chat));
        }
    }
}
