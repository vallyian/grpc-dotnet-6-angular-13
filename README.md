# grpc-dotnet-6-angular-13

## Development

### Prerequisites

* [Visual Studio 2022](https://visualstudio.microsoft.com/vs/)
* [dotnet 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
* [Node.js LTS](https://nodejs.org/en/)

### Create server

[official docs](https://docs.microsoft.com/en-us/aspnet/core/grpc/browser?view=aspnetcore-6.0)

* create new project with `ASP.NET Core gRPC Service` template
  * choose `server` as project name
  * choose `the_app_name` as solution name
  * choose `.NET 6` framework

* add `Grpc.AspNetCore.Web` nuget package to `server.csproj`

```xml
<ItemGroup>
  <PackageReference Include="Grpc.AspNetCore" Version="2.41.0" />
  <PackageReference Include="Grpc.AspNetCore.Web" Version="2.41.0" />
</ItemGroup>
```

* sln => add `existing website` => create and select `proto` folder beside `server` folder

* move exisiting files from `server/protos` to `proto` folder and update paths in `server.csproj`

```xml
<ItemGroup>
  <Protobuf Include="..\proto\greet.proto" GrpcServices="Server" />
</ItemGroup>
```

* update `./server/Program.cs`:

```cs
using server.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddGrpc();

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseGrpcWeb(new GrpcWebOptions { DefaultEnabled = true });
app.UseEndpoints(e => e.MapGrpcService<GreeterService>());
app.Run();
```

* update `./server/Properties/launchSettings.json`

```json
{
  "profiles": {
    "server": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "https://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

### Create client

* cmd in solution folder and `ng new client`

* add `existing website` => select `client`

* `cd client`

* add `npm i -D grpc-web-ts-compiler`

* add scripts to `package.json`

```json
{
  "scripts": {
    "start": "npm run proto && npm run watch",
    "build": "ng build --output-path ../server/wwwroot",
    "watch": "npm run build -- --watch --configuration development",
    "proto": "npx proto ../proto ./src/app/proto",
  }
}
```

* generate proto helper files `npm run proto`

* add the generated folder `client/src/app/proto` to `.gitignore` and `.dockerignore`

* create a grpc service `ng g s greeter` with:

```ts
import { Injectable } from "@angular/core";
import { GreeterClient } from "./proto/greet_pb_service"
import { HelloRequest, HelloReply } from "./proto/greet_pb"

@Injectable({ providedIn: "root" })
export class GreeterService {
  private readonly client = new GreeterClient(location.origin, { debug: true });

  async sayHello(props: HelloRequest.AsObject) {
    const request = new HelloRequest();

    request.setName(props.name);
    request.setClient(props.client);

    return new Promise<HelloReply.AsObject>((resolve, reject) =>
      this.client.sayHello(
        request,
        (err, response) => err || response === null
          ? reject(err || "invalid grpc response")
          : resolve(response.toObject())
      )
    );
  }
}
```

* consume it (e.g. in a component)

```ts
import { Component, OnInit } from '@angular/core';
import { GreeterService } from './greeter.service';

@Component({
  selector: 'app-root',
  template: `
    <p>open dev tools (F12) and refresh (F5) to see it in action</p>
    <p>greeter.sayHello(...) => <span>{{sayHelloResponse | json}}</span></p>
  `
})
export class AppComponent implements OnInit {
  constructor(
    private readonly greeter: GreeterService
  ) { }

  sayHelloResponse: any;

  readonly greet = () => this.greeter.sayHello({ 
    name: "simple grpc demo",
    client: "" /* optional proto prop requires a default value provided */
  });

  async ngOnInit() {
    this.sayHelloResponse = await this.greet().catch(err => err);
  }
}
```

### Run dev

* client `cd client && npm start`
* server `cd server && dotnet build && dotnet run`
* visit [https://localhost:5000](https://localhost:5000)

### Docker

* build `docker build -t grpc-dotnet-6-angular-13 .`
* run `docker run --rm --network host grpc-dotnet-6-angular-13`
* visit [https://localhost:5000](https://localhost:5000)
