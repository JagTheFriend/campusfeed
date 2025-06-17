"use server";

const GET_EVENTS = `
  query EventData {
    eventModels {
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

export async function getEvents() {
  try {
    const response = await fetch(process.env.NEXT_HYGRAPH_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        query: GET_EVENTS,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      return { data: [] };
    }

    const events = result.data.eventModels.map((record) => {
      return {
        eventPoster: record.posterImage,
        eventName: record.title,
        eventLocation: record.venue,
        eventDate: new Date(record.start)
          .toLocaleString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(",", "")
          .replaceAll(" ", "-"),
        eventEndDate: new Date(record.end)
          .toLocaleString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(",", "")
          .replaceAll(" ", "-"),
        eventPrize: parseFloat(record.eventPrize),
        eventDescription: record.description.html,
        registrationLink: record.registrationLink,
        guideLinePdfLink: record.guideLinePdfLink,
      };
    });

    return { data: events };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { data: [] };
  }
}
