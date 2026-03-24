using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Whisper.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Key : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SignedPreKeySignature",
                table: "UserDevices",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SignedPreKeySignature",
                table: "UserDevices");
        }
    }
}
