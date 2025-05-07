using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CosmoCargo.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomsDeclaration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "customs_declarations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    shipment_id = table.Column<Guid>(type: "uuid", nullable: false),
                    contains_lifeforms = table.Column<bool>(type: "boolean", nullable: false),
                    lifeform_type = table.Column<string>(type: "text", nullable: true),
                    is_plasma_active = table.Column<bool>(type: "boolean", nullable: false),
                    plasma_stability_level = table.Column<int>(type: "integer", nullable: true),
                    quarantine_required = table.Column<bool>(type: "boolean", nullable: false),
                    origin_planet_laws_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    customs_notes = table.Column<string>(type: "text", nullable: true),
                    risk_level = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("p_k_customs_declarations", x => x.id);
                    table.ForeignKey(
                        name: "f_k_customs_declarations__shipments_shipment_id",
                        column: x => x.shipment_id,
                        principalTable: "shipments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "i_x_customs_declarations_shipment_id",
                table: "customs_declarations",
                column: "shipment_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "customs_declarations");
        }
    }
}
