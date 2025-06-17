"use server";
import { EventSchema } from "../../lib/schema";

export async function addEvent(formData) {
  const eventData = EventSchema.safeParse(formData);

  if (!eventData.success) {
    console.log("error", eventData.error.errors);
    return {
      success: false,
      message: "Invalid data",
    };
  }

  try {
    const CREATE_EVENT = `
      mutation CreateEventModel($data: EventModelCreateInput!) {
        createEventModel(data: $data) {
          title
          eventPrize
          description
          posterImage
          start
          end
          venue
          organizingSchoolOrSociety
          socialMedia
          contactNumber
          emailId
          registrationLink
          guideLinePdfLink
          relationToUser
        }
      }
    `;

    const variables = {
      data: {
        title: eventData.data.title,
        eventPrize: parseFloat(eventData.data.prizeAmount),
        description: eventData.data.description,
        posterImage: eventData.data.image,
        start: new Date(eventData.data.startDate).toISOString(), // Convert to ISO8601
        end: new Date(eventData.data.endDate).toISOString(),
        venue: eventData.data.venue,
        organizingSchoolOrSociety: eventData.data.school,
        socialMedia: eventData.data.socialLinks,
        contactNumber: parseInt(eventData.data.phone),
        emailId: eventData.data.email,
        registrationLink: eventData.data.registrationLinks,
        guideLinePdfLink: eventData.data.guideLinePdfLink,
        relationToUser: eventData.data.position,
      },
    };

    const response = await fetch(process.env.NEXT_HYGRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_HYGRAPH_TOKEN}`,
      },
      body: JSON.stringify({
        query: CREATE_EVENT,
        variables: variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      return {
        success: false,
        message: "Failed to submit event",
      };
    }

    // Telegram verification message
    const text = `
      Title : ${eventData.data.title}\n
      Desc : ${eventData.data.description}\n
      Start Date : ${eventData.data.startDate}\n
      End Date : ${eventData.data.endDate}\n
      Venue : ${eventData.data.venue}\n
      Organizing School : ${eventData.data.school}\n
      Social Link : ${eventData.data.socialLinks}\n
      Phone No. :${eventData.data.phone}\n
      Email Id : ${eventData.data.email}\n
      Registration Link : ${eventData.data.registrationLinks}\n
      GuideLine PDF Link : ${eventData.data.guideLinePdfLink || "NA"}\n
      Posted by Society's : ${eventData.data.position}
      `;
    const POST_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${text}`;
    await fetch(POST_URL);

    // Return success if all execution is successful
    return {
      success: true,
      message: "Event submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting event:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
