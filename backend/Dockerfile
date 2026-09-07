FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY backend/GrowthLog.sln ./backend/
COPY backend/src/GrowthLog.Domain/GrowthLog.Domain.csproj ./backend/src/GrowthLog.Domain/
COPY backend/src/GrowthLog.Application/GrowthLog.Application.csproj ./backend/src/GrowthLog.Application/
COPY backend/src/GrowthLog.Infrastructure/GrowthLog.Infrastructure.csproj ./backend/src/GrowthLog.Infrastructure/
COPY backend/src/GrowthLog.Api/GrowthLog.Api.csproj ./backend/src/GrowthLog.Api/
COPY backend/tests/GrowthLog.Application.Tests/GrowthLog.Application.Tests.csproj ./backend/tests/GrowthLog.Application.Tests/
COPY backend/tests/GrowthLog.Api.Tests/GrowthLog.Api.Tests.csproj ./backend/tests/GrowthLog.Api.Tests/

RUN dotnet restore ./backend/GrowthLog.sln

# Copy all source files and publish API
COPY backend/ ./backend/
RUN dotnet publish ./backend/src/GrowthLog.Api/GrowthLog.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "GrowthLog.Api.dll"]
