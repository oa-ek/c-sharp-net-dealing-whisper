using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Whisper.Application.DTOs.MessageDTOs;
using Whisper.Application.DTOs.ReactionDTOs;
using Whisper.Application.Interfaces.Services;

namespace Whisper.API.Controllers
{
    [Authorize]
    public class WSChatController : Hub
    {
        private readonly IMessageService _messageService;
        private readonly IReactionService _reactionService;

        public WSChatController(IMessageService messageService, IReactionService reactionService)
        {
            _messageService = messageService;
            _reactionService = reactionService;
        }

        // Helper property to get UserId from Claims correctly
        private string? UserId => Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        public async Task JoinChat(string chatId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"chat-{chatId}");
        }

        public async Task LeaveChat(string chatId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"chat-{chatId}");
        }

        // Creates message, saves to db and returns new message with id
        public async Task MessageSend(MessageCreateDto message)
        {
            if (string.IsNullOrEmpty(UserId)) throw new HubException("Unauthorized");

            var resultMessage = await _messageService.AddAsync(UserId, message);
            if (resultMessage != null)
            {
                await Clients.Group($"chat-{message.ChatId}").SendAsync("message-new", resultMessage);
            }
        }

        // Changes message's contents, saves to db and returns new message
        public async Task MessageEdit(MessageUpdateDto message)
        {
            if (string.IsNullOrEmpty(UserId)) throw new HubException("Unauthorized");

            var resultMessage = await _messageService.EditAsync(UserId, message);
            if (resultMessage != null)
            {
                await Clients.Group($"chat-{resultMessage.ChatId}").SendAsync("message-edited", resultMessage);
            }
        }

        // Adds reaction to the a message, saves to db and returns message with new reaction
        public async Task ReactionAdd(ReactionCreateDto reaction)
        {
            if (string.IsNullOrEmpty(UserId)) throw new HubException("Unauthorized");

            var resultMessage = await _reactionService.AddReaction(UserId, reaction);
            if (resultMessage != null)
            {
                await Clients.Group($"chat-{resultMessage.ChatId}").SendAsync("reaction-added", resultMessage);
            }
        }

        // Removes reaction from the message, saves to db and returns message without that reaction
        public async Task ReactionRemove(ReactionRemoveDto reaction)
        {
            if (string.IsNullOrEmpty(UserId)) throw new HubException("Unauthorized");

            var resultMessage = await _reactionService.RemoveReaction(UserId, reaction);
            if (resultMessage != null)
            {
                await Clients.Group($"chat-{resultMessage.ChatId}").SendAsync("reaction-removed", resultMessage);
            }
        }

        // Sets message's delivery status to read, saves in db and returns result message
        public async Task MessageRead(string messageId)
        {
            if (string.IsNullOrEmpty(UserId)) throw new HubException("Unauthorized");

            var resultMessage = await _messageService.MarkReadAsync(UserId, messageId);
            if (resultMessage != null)
            {
                await Clients.Group($"chat-{resultMessage.ChatId}").SendAsync("message-read", resultMessage);
            }
        }

        // Just returns that user started typing
        public async Task TypingStart(string chatId)
        {
            if (string.IsNullOrEmpty(UserId)) throw new HubException("Unauthorized");
            await Clients.Group($"chat-{chatId}").SendAsync("typing-start", UserId);
        }

        // Just returns that user is no longer typing
        public async Task TypingStop(string chatId)
        {
            if (string.IsNullOrEmpty(UserId)) throw new HubException("Unauthorized");
            await Clients.Group($"chat-{chatId}").SendAsync("typing-stop", UserId);
        }
    }
}