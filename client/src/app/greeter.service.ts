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
