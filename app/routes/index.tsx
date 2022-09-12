export default function Index() {
  return (
    <main>
      <div className="hero bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src="https://placeimg.com/260/400/arch"
            className="max-w-sm rounded-lg shadow-2xl"
          />
          <article className="prose">
            <h1>Welcome to the Tech Assessment</h1>
            <p>
              Please get yourself familiar with the codebase, as we will be
              coding up the solution for a given task during the assessment.
            </p>
            <p>
              You will be given a list of tasks at the start of the assessment
              that you may choose from, covering different aspects of
              development. Don't worry about which task(s) to choose, just pick
              one(s) that you feel most comfortable with.
            </p>
            <p>
              The assessment is not designed to need intense algorithmic
              knowledge, nor is it designed to catch you out, but rather just
              allow us to see how you work and thought processes.
            </p>
          </article>
        </div>
      </div>
      <article className="prose mx-auto w-full max-w-4xl pt-10">
        <h3>This project is a generic job website</h3>
        <p>
          There are users and there are jobs. A user can add a job, and a user
          can apply for a job.
        </p>
        <p>
          The login and sign up functionality is all working so you can sign up
          as many users as you'd like.
        </p>
        <p>The password for all seeded users is 'password'. Super secure.</p>

        <p>
          Please familiarise yourself with the following libraries, and please
          feel free to have the docs open during the session:
        </p>
        <ul>
          <li>
            <a href="https://remix.run/docs/en/v1">Remix</a>
          </li>
          <li>
            <a href="https://www.prisma.io/docs/">Prisma</a>
          </li>
          <li>
            <a href="https://tailwindcss.com/docs">Tailwind CSS</a>
          </li>
          <li>
            <a href="https://daisyui.com/">DaisyUI</a>
          </li>
        </ul>
      </article>
    </main>
  );
}
