using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Whisper.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangedUsersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "TokenExpiresAt",
                table: "Users",
                newName: "LastSeen");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Users",
                newName: "Bio");

            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "UserDevices",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "TokenExpiresAt",
                table: "UserDevices",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "UserDevices");

            migrationBuilder.DropColumn(
                name: "TokenExpiresAt",
                table: "UserDevices");

            migrationBuilder.RenameColumn(
                name: "LastSeen",
                table: "Users",
                newName: "TokenExpiresAt");

            migrationBuilder.RenameColumn(
                name: "Bio",
                table: "Users",
                newName: "Description");

            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
