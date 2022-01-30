import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import { createClient } from "@supabase/supabase-js";
import React from "react";
import appConfig from "../config.json";
import supabaseConfig from "../config";

const SUPABASE_PUBLIC_KEY = supabaseConfig.SUPABASE_PUBLIC_KEY;
const SUPABASE_URL = supabaseConfig.SUPABASE_URL;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from("messages")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
      });
  }, []);

  console.log("Mensagens", listaDeMensagens);

  function handleNewMessage(newMessage) {
    const user = localStorage.getItem("aluracord.user")
      ? localStorage.getItem("aluracord.user")
      : "Visitante";
    const mensagem = {
      // id: listaDeMensagens.length + 1,
      from: user,
      // from: "user01",
      message: newMessage,
    };
    // setMensagem('');
    // Backend
    supabaseClient
      .from("messages")
      .insert([mensagem])
      .then(({ data }) => {
        console.log("add mensagem", data);
        setListaDeMensagens([data[0], ...listaDeMensagens]);
      });

    // setListaDeMensagens([
    //   mensagem,
    //   ...listaDeMensagens,
    //   // newMessage,
    // ]);
    setMensagem("");
  }

  function deleteMessage(id) {
    supabaseClient
      .from("messages")
      .delete()
      .match({ id: id })
      .then(({ data }) => {
        console.log("delete mensagem", data);
        // setListaDeMensagens([data[0], ...listaDeMensagens]);
      });

    const list = listaDeMensagens.filter((message) => message.id !== id);
    setListaDeMensagens(list);
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          {/* {mensagem} */}
          <MessageList
            messages={listaDeMensagens}
            removeMessage={deleteMessage}
          />
          {/* <MessageList /> */}

          {/* {listaDeMensagens.map((mensagemAtual, index) => {
            return (
              <li key={mensagemAtual.id}>
                {mensagemAtual.from}: {mensagemAtual.message}
              </li>
            );
          })} */}
          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const value = event.target.value;
                setMensagem(value);
              }}
              onKeyPress={(event) => {
                if (event.key == "Enter") {
                  event.preventDefault();

                  handleNewMessage(mensagem);

                  console.log(event.key);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              onClick={() => {
                handleNewMessage(mensagem);
              }}
              label="ok"
              styleSheet={{
                backgroundColor: appConfig.theme.colors.neutrals[800],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.messages.map((message) => {
        return (
          <Text
            tag="li"
            key={message.id}
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              position: "relative",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${message.from}.png`}
              />
              <Text tag="strong">{message.from}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>

              {localStorage.getItem("aluracord.user") == message.from && (
                <Button
                  label="X"
                  onClick={() => {
                    props.removeMessage(message.id);
                  }}
                  styleSheet={{
                    position: "absolute",
                    right: "16px",
                  }}
                />
              )}
            </Box>
            {message.message}
          </Text>
        );
      })}
    </Box>
  );
}
