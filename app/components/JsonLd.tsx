export default function JsonLd() {
    const schema = [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FlutterInit",
            url: "https://flutterinit.com",
        },
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "FlutterInit",
            url: "https://flutterinit.com",
            description:
                "FlutterInit scaffolds your entire Flutter app with your preferred state management, routing, and utilities — production-ready in under 60 seconds.",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            isAccessibleForFree: true,
            creator: {
                "@type": "Person",
                name: "Arjun Mahar",
                url: "https://github.com/Arjun544",
            },
        },
    ];

    return (
        <>
            {schema.map((s, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
                />
            ))}
        </>
    );
}