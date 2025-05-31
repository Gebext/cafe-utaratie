export function success(message: string, data: any = null, pagination?: any) {
  return Response.json({
    status: "success",
    message,
    data,
    ...(pagination && { pagination }),
  });
}

export function error(message: string, code = 400) {
  return Response.json(
    { status: "error", message, data: null },
    { status: code }
  );
}
