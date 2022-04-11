import Router from "next/router";
import { signIn } from "next-auth/react";
import { hideNotification } from "../helpers/helpers";
import { uiActions } from "./ui-slice";
import { AppDispatch } from ".";
const headers = {
  "Content-Type": "application/json",
};
export const signInUser = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    const sendRequest = async () => {
      const status: any = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
      if (status.error !== null) {
        throw new Error("Something went wrong!");
      }
    };
    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          type: "success",
          message: "Successfully signed in!",
        })
      );
      Router.replace("/");
      hideNotification(dispatch);
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          type: "error",
          message: "something went wrong",
        })
      );
      hideNotification(dispatch);
    }
  };
};
export const signUpUser = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    const sendRequest = async () => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
    };
    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          type: "success",
          message: "Successfully signed up!",
        })
      );
      dispatch(signInUser(email, password));
      hideNotification(dispatch);
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          type: "error",
          message: "something went wrong",
        })
      );
      hideNotification(dispatch);
    }
  };
};
