export default class APIServices {
  //Get shop info and create
  async getStoreData() {

    const response = await fetch(`/api/store/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const result = await response.json();
    console.log("------resultttttttapi", result);

    return result;
  }
  // async getQuoteList() {
  //     // console.log("----apicalled");

  //     //  'http://localhost:63184/external/store/info?shop=testing-checkout-r-itg.myshopify.com',
  //     const response = await fetch(`/api//quotation/list`, {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //         }
  //     });
  //     const result = await response.json();
  //     console.log("------resultttttttapi",result);

  //     return result;
  // }
  // ---
  async getQuoteList(data) {


    const response = await fetch(`/api/admin-quote/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data)
    });




    const result = await response.json();
    console.log("------resultttttttapi", result);
    return result;

  }

  // ---particcular quote data 
  async getQuoteDataById(id) {


    const response = await fetch(`/api/admin-quote/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      //   body: JSON.stringify({
      //     limit: "10",
      //     page: "2"
      //   })
    });




    const result = await response.json();
    console.log("------resultttttttapi", result);
    return result;

  }

  // get appSettings
  async getAppSettings() {

    const response = await fetch(`/api/store/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const result = await response.json();
    console.log("------resultttttttapi", result);

    return result;
  }

  // update settings

  async UpdateAppsettings(data) {
    const response = await fetch(`/api/store/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;

  }

  // get notifictaionSettings
   async getNotificationSettings() {

    const response = await fetch(`/api/notification/details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const result = await response.json();
    console.log("------resultttttttapi", result);

    return result;
  }
  // update Notification Settings
  async UpdateNotificationSettings(data) {

    const response = await fetch(`/api/notification/save`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify(data)
    });
    const result = await response.json();

    return result;
  }
  // get Template Details
   async getTemplateDetails(data) {

    const response = await fetch(`/api/notification/template-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify(data)
    });
    const result = await response.json();

    return result;
  }
  // update Template Detailss
    async UpdateTemplateDetails(data) {


    const response = await fetch(`/api/notification/update-type`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify(data)
    });
    const result = await response.json();
console.log("'----------result",result)
    return result;
  }
  // previewTemplate
   async PreviewTemplate(data) {


    const response = await fetch(`/api/notification/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
  }

  // aNalytics Get
   async getAnalyticsDetails() {
console.log("--------------------------------------chlllll")
    const response = await fetch(`/api/analytics/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();

    return result;
  }
  // get producttypesetting list
 async getProductSettings(data) {

    const response = await fetch(`/api/types/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log("------resultttttttapi", result);

    return result;
  }

  // update producttypesetting list

  async AddProductTypeSettings(data) {


    const response = await fetch(`/api/types/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
  }

  // dellete producttypesetting list
  async UpdateProductTypeSettings(id,data) {


    const response = await fetch(`/api/types/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();

    return result;
  }


  // add producttypesetting list

  async DeleteProductTypeSettings(id) {


    const response = await fetch(`/api/types/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    return result;
  }
  // getDesignList

   async getDesignList(data) {
    const response = await fetch(`/api/designers/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data)
    });
   const result = await response.json();
    console.log("------resultttttttapi", result);
    return result;

  }
  // adddesign
  async AddDesign(data) {


    const response = await fetch(`/api/designers/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data)
    });




    const result = await response.json();
    console.log("------resultttttttapi", result);
    return result;

  }
  // updatedesign
    async UpdateDesign(id,data) {
    const response = await fetch(`/api/designers/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();

    return result;
  }

  // deleteDesign
   async DeleteDesign(id) {
   console.log("delete caklled")
    const response = await fetch(`/api/designers/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    return result;
  }
  // makeOffer 
    async UpdateProductTypeSettings(id,data) {


    const response = await fetch(`/api/admin-quote/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();

    return result;
  }
}

