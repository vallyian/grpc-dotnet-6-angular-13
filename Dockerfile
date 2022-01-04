FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-server
WORKDIR /server
COPY ./server/server.csproj .
RUN dotnet restore ./server.csproj
COPY ./server .
COPY ./proto ../proto
RUN dotnet publish ./server.csproj --no-restore -c Release -o ./publish

FROM node:lts AS build-client
WORKDIR /client
COPY ./client/package*.json ./
RUN npm ci
COPY ./client .
COPY ./proto ../proto
RUN npm run proto && npm run build

# for testing only
FROM build-server AS runtime
RUN dotnet dev-certs https --trust
WORKDIR /server/publish
COPY --from=build-client /server/wwwroot ./wwwroot
CMD ["dotnet", "server.dll", "--urls", "https://localhost:5000/"]

# FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
# WORKDIR /app
# COPY --from=build-server /server/publish .
# COPY --from=build-client /server/wwwroot ./wwwroot
# EXPOSE 5000
# ENTRYPOINT ["dotnet", "server.dll"]
