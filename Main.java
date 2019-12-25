//import com.sun.net.httpserver.*;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class Main {
    public static void main(String[] args) {

        try {
            int port = 8000;
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
            System.out.println("service runs on port: " + port);
            server.createContext("/test", new TestHandler());
            server.createContext("/addStory", new POstHandler());
            server.setExecutor(null); // creates a default executor
            server.start();
        }
        catch (IOException ex){
            System.out.println(ex);
        }
    }
}


class TestHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange t) throws IOException {
        String response = "This is the response";
        t.sendResponseHeaders(200, response.length());
        OutputStream os = t.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}


class POstHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange t) throws IOException {
        String response = "{ \"contacts\": [ { \"id\": \"c200\", \"name\": \"Ravi Tamada\", \"email\": \"ravi@gmail.com\", \"address\": \"xx-xx-xxxx,x - street, x - country\", \"gender\" : \"male\", \"phone\": { \"mobile\": \"+91 0000000000\", \"home\": \"00 000000\", \"office\": \"00 000000\" } }, { \"id\": \"c201\", \"name\": \"Johnny Depp\", \"email\": \"johnny_depp@gmail.com\", \"address\": \"xx-xx-xxxx,x - street, x - country\", \"gender\" : \"male\", \"phone\": { \"mobile\": \"+91 0000000000\", \"home\": \"00 000000\", \"office\": \"00 000000\" } } ] }";
//        t.getResponseHeaders().set("Content-Type", "appication/json");
        t.getResponseHeaders().set("Content-Type", "application/json, charset=UTF-8");
        t.sendResponseHeaders(200, response.length());
        OutputStream os = t.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}