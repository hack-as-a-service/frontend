import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { IUser } from "../types/haas";
import { fetchSSR } from "./fetch";

export enum OnAuthFailure {
	Continue,
	RedirectToLogin,
}

export enum OnOtherFailure {
	RedirectToLogin,
	ReturnNotFound,
}

type Reqs = [IUser, ...any[]];

export default function withAuth(
	next: GetServerSidePropsWithAuth,
	otherUrls: string[] = [],
	onAuthFailure = OnAuthFailure.RedirectToLogin,
	onOtherFailure = OnOtherFailure.ReturnNotFound,
	loginRedirectUrl = "/api/login"
): GetServerSidePropsWithAuth {
	const loginRedirect = {
		redirect: { destination: loginRedirectUrl, permanent: false },
	};
	return async (ctx) => {
		try {
			const reqs = (await Promise.all(
				["/users/me", ...otherUrls].map((i) => fetchSSR(i, ctx))
			)) as Reqs;
			return await next({ ...ctx, reqs });
		} catch (e) {
			if (e.url === "/users/me") {
				switch (onAuthFailure) {
					case OnAuthFailure.Continue:
						return await next(ctx);
					case OnAuthFailure.RedirectToLogin:
						return loginRedirect;
				}
			} else {
				switch (onOtherFailure) {
					case OnOtherFailure.ReturnNotFound:
						return {
							notFound: true,
						};
					case OnOtherFailure.RedirectToLogin:
						return loginRedirect;
				}
			}
		}
	};
}

// the only difference between this and the normal GetServerSideProps type from next is that this uses our custom context type
export type GetServerSidePropsWithAuth<
	P extends { [key: string]: any } = { [key: string]: any },
	Q extends ParsedUrlQuery = ParsedUrlQuery,
	D extends PreviewData = PreviewData
> = (context: ContextWithAuth<Q, D>) => Promise<GetServerSidePropsResult<P>>;

// this context type adds a `reqs` property which is an array of the requests made
type ContextWithAuth<
	Q extends ParsedUrlQuery = ParsedUrlQuery,
	D extends PreviewData = PreviewData
> = GetServerSidePropsContext<Q, D> & { reqs: Reqs };
