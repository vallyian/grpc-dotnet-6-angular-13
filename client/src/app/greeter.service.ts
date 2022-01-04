import { Injectable } from "@angular/core";
import { GreeterClient } from "./proto/greet_pb_service"
import { HelloRequest, HelloReply } from "./proto/greet_pb"

@Injectable({ providedIn: "root" })
export class GreeterService {
    private readonly client = new GreeterClient(location.origin, { debug: true });

    // on Windows, `optional` proto props are not marked with `?` in generated `.d.ts`
    // on Linux, `optional` proto props are not recognized by libprotoc 3.6.1
    // for safety, declare `props: Partial<HelloRequest.AsObject>` and validate props individually
    async sayHello(props: Partial<HelloRequest.AsObject>) {
        const request = new HelloRequest();

        // required prop
        if (props.name === undefined)
            throw Error(`"name" prop is required`);
        request.setName(props.name);

        // // optional prop
        // if (props.client !== undefined)
        //     request.setClient(props.client);

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
