# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Define build arguments
ARG ASPNETCORE_ENVIRONMENT=Development
ARG CONNECTION_STRING

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=$ASPNETCORE_ENVIRONMENT
ENV ConnectionStrings__DefaultConnection=$CONNECTION_STRING

WORKDIR /src
COPY ["*.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CosmoCargo.dll"]

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
