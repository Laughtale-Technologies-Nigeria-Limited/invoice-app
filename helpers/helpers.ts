import { nanoid } from "nanoid";
import { InvoiceType, ItemsType } from "./../types/types";
import { AppDispatch } from "../store";
import { uiActions } from "../store/ui-slice";
export const hideNotification = (dispatch: AppDispatch) => {
  const notificationTime = 3000;
  setTimeout(() => {
    dispatch(uiActions.hideNotification());
  }, notificationTime);
};
export const transformInvoiceObject = (invoice: InvoiceType) => {
  const senderAddress = {
    streetAddress: invoice.senderAddress.street,
    city: invoice.senderAddress.city,
    postCode: invoice.senderAddress.postCode,
    country: invoice.senderAddress.country,
  };
  const clientAddress = {
    clientCity: invoice.clientAddress.city,
    clientStreetAddress: invoice.clientAddress.street,
    clientPostCode: invoice.clientAddress.postCode,
    clientCountry: invoice.clientAddress.country,
  };
  const transformedObject = {
    clientName: invoice.clientName,
    clientEmail: invoice.clientEmail,
    projectDescription: invoice.description,
    date: new Date(invoice.createdAt),
    paymentTerms: invoice.paymentTerms,
    ...senderAddress,
    ...clientAddress,
  };
  return transformedObject;
};
export const transformInvoiceItems = (items: []) => {
  let transformedItems: ItemsType[] = [];
  items.forEach((item: ItemsType) => {
    let itemObject = {
      name: "",
      price: 0,
      quantity: 0,
      id: 0,
      total: 0,
    };
    Object.defineProperties(itemObject, {
      name: {
        value: item.name,
        writable: true,
      },
      price: {
        value: item.price,
        writable: true,
      },
      quantity: {
        value: item.quantity,
        writable: true,
      },
      id: {
        value: item.id,
        writable: true,
      },
      total: {
        value: item.total,
        writable: true,
      },
    });
    transformedItems.push(itemObject);
  });
  return transformedItems;
};
export const createInvoiceData = (
  values: any,
  items: ItemsType[],
  status: "paid" | "draft" | "pending",
  id: string
) => {
  let totalPrice = 0;
  const itemsCopy = [...items];
  itemsCopy.forEach((item) => {
    item.total = item.quantity * item.price;
    totalPrice += item.total;
  });
  let paymentDueTransformed = new Date();
  paymentDueTransformed.setDate(values.date.getDate() + values.paymentTerms);
  const newInvoiceData: InvoiceType = {
    status: status,
    clientName: values.clientName,
    clientEmail: values.clientEmail,
    clientAddress: {
      street: values.clientStreetAddress,
      city: values.clientCity,
      postCode: values.clientPostCode,
      country: values.clientCountry,
    },
    description: values.projectDescription,
    senderAddress: {
      street: values.streetAddress,
      city: values.city,
      postCode: values.postCode,
      country: values.country,
    },
    paymentTerms: values.paymentTerms,
    createdAt: values.date.toDateString(),
    paymentDue: paymentDueTransformed.toDateString(),
    id: id,
    items: itemsCopy,
    total: totalPrice,
  };
  return newInvoiceData;
};
export const createId = () => {
  const id = nanoid(5);
  return id;
};
